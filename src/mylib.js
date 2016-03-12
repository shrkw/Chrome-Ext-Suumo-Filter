function modifyExcludingWord(word, func) {
  chrome.storage.local.get('excluding', (ret)=> {
    const exc = ret.excluding;
    let set = new Set(exc);
    func(set, word);
    const trans = [...set];
    chrome.storage.local.set({'excluding': trans}, ()=> { });
  });
}

export function addExcludingWord(word) {
  modifyExcludingWord(word, (set, word) => {
    const val = window.prompt("除外対象に追加する文字列を入力してください", word);
    set.add(val);
  });
}

export function removeExcludingWord(word) {
  modifyExcludingWord(word, (set, word) => {
    set.delete(word);
  });
}
