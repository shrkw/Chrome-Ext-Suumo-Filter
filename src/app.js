(function() {
  console.log('start');
  function set() {
    var dd = new Date();
    var theValue = ['aaa' + dd,'bbb' + dd];
    chrome.storage.local.set({'excluding': theValue}, function() {
      // Notify that we saved.
      console.log('Settings saved');
    });
  }
  function get() {
    chrome.storage.local.get('excluding', function (value) {
      var value_data = value.excluding;
      console.log(value_data);
      console.log('you got it?');
    });
  }
  set();
  get();


  console.log('finish loading');
}).call(this);
