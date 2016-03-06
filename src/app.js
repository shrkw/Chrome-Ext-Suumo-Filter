chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log(`Storage key "${key}" in namespace "${namespace}" changed. Old value was "${storageChange.oldValue}", new value is "${storageChange.newValue}".`);
    reduceAttention();
  }
});

const reduceAttention = () => {
  console.log('do something for reducing attention');
  chrome.storage.local.get('excluding', (ret)=> {
    const exc = ret.excluding;
    let set = new Set(exc);

    $("div.property_unit").each((index, elem)=> {
      let unit = $(elem);
      console.log(unit);
      const title = unit.find("div.property_unit-header h2 a").html();
      console.log(title);
      set.forEach((val)=> {
        if (title.indexOf(val) != -1) {
          unit.addClass("shrkw-hide");
        }
      });
    });
  });
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

const insertButtons = () => {
  let clearButton = $('div#js-pageTop').append("<button class='shrkw-clear'>Clear</button>");
  clearButton.on("click", ()=> {chrome.storage.local.clear(()=> {console.log('cleared');})})

  $("input.js-clipkey").after("<button class='shrkw-excluding'>Exc</button>");
  $("button.shrkw-excluding").on("click", (e)=> {
    e.preventDefault();
    console.log(e);
    var title_a = $(e.target).closest("div.property_unit").find("div.property_unit-header h2 a");
    addExcludingWord(title_a.html());
  });

}

insertButtons();
reduceAttention();
