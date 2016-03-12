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
