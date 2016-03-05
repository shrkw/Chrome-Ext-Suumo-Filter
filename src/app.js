console.log('start');

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log(`Storage key "${key}" in namespace "${namespace}" changed. Old value was "${storageChange.oldValue}", new value is "${storageChange.newValue}".`);
    reduceAttention();
  }
});

const reduceAttention = () => {
  console.log('do something for reducing attention');
}

const addExcludingWord = (word) => {
  chrome.storage.local.get('excluding', (ret)=> {
    const exc = ret.excluding;
    let set = new Set(exc);
    const val = window.prompt("除外対象に追加する文字列を入力してください", word);
    set.add(val);
    console.log(set);
    const trans = [...set];
    chrome.storage.local.set({'excluding': trans}, ()=> { });
  });
}

$('div.logoarea').on("click", ()=> {addExcludingWord("a")})

$('h1.zentitle').on("click", ()=> {chrome.storage.local.clear(()=> {console.log('cleared');})})

reduceAttention();
console.log('finish loading');
