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
    $("div.property_unit").each((index, elem)=> {
      let unit = $(elem);
      const title = unit.find("div.property_unit-header h2 a").html();
      const found = exc.some((val)=> {
        if (title.indexOf(val) != -1) {
          unit.addClass("shrkw-hide");
          return true;
        }
      });
      if (!found) {
        unit.removeClass("shrkw-hide");
      }
    });
  });
}

function insertButtons() {
  $("input.js-clipkey").after("<button class='shrkw-excluding'>Exc</button>");
  $("button.shrkw-excluding").on("click", (e)=> {
    e.preventDefault();
    var title_a = $(e.target).closest("div.property_unit").find("div.property_unit-header h2 a");
    lib.addExcludingWord(title_a.html());
  });
}

insertButtons();
reduceAttention();
