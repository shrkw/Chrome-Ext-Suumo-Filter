import $ from 'jquery'
import Mustache from 'mustache'
import * as lib from './mylib'

const template = $('#tmpl').html();
Mustache.parse(template);

chrome.storage.local.get('excluding', (ret)=> {
  const exc = ret.excluding;
  const set = new Set(exc);
  set.forEach((val)=> {
    const rendered = $(Mustache.render(template, {value: val}));
    rendered.find(".action").on("click", (event)=> {
      lib.removeExcludingWord(event.target.dataset.val);
      $(event.target).parents("tr.exclude").remove();
    });
    $("#message_txt").append(rendered);
  });
});

chrome.storage.local.get('excluding', (ret)=> {
  const exp = JSON.stringify(ret, null, '  ');
  $("pre#export_area").html(exp);
  $("textarea#import_area").html(exp);
});

$("button#update").on("click", (e) => {
  e.preventDefault();
  const new_val = JSON.parse($("textarea#import_area").val());
  const exc = new_val.excluding;
  let set = new Set(exc);
  const trans = [...set];
  console.log(trans);
  chrome.storage.local.set({'excluding': trans}, ()=> {
    $(".alert-update").slideToggle(500, () => {
      setTimeout(() => {
        $(".alert-update").slideToggle(500)
      }, 3000)
    })
  });
});
