import $ from 'jquery'
import * as lib from './mylib'

chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (var key in changes) {
    var storageChange = changes[key];
    console.log(`Storage key "${key}" in namespace "${namespace}" changed. Old value was "${storageChange.oldValue}", new value is "${storageChange.newValue}".`);
    reduceAttention();
  }
});

function reduceAttention() {
  chrome.storage.local.get('excluding', (ret)=> {
    const exc = ret.excluding;
    let set = new Set(exc);

    $("div.property_unit").each((index, elem)=> {
      let unit = $(elem);
      const title = unit.find("div.property_unit-header h2 a").html();
      set.forEach((val)=> {
        if (title.indexOf(val) != -1) {
          unit.addClass("shrkw-hide");
        } else {
          unit.removeClass("shrkw-hide");
        }
      });
    });
  });
}

function insertButtons() {
  let clearButton = $('div#js-pageTop').append("<button class='shrkw-clear'>Clear</button>");
  clearButton.on("click", ()=> {chrome.storage.local.clear(()=> {console.log('cleared');})})

  $("input.js-clipkey").after("<button class='shrkw-excluding'>Exc</button>");
  $("button.shrkw-excluding").on("click", (e)=> {
    e.preventDefault();
    var title_a = $(e.target).closest("div.property_unit").find("div.property_unit-header h2 a");
    lib.addExcludingWord(title_a.html());
  });
}

insertButtons();
reduceAttention();
