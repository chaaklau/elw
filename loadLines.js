var data;

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function openTab(tab){
  $('.nav-tabs a[href="#' + tab + '"]').tab('show');
};

function openWord(evt, wordName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("word_panel");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("word_tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the link that opened the tab
    document.getElementById(wordName).style.display = "block";
    evt.currentTarget.className += " active";
}


// Item formatting functions
function getTabTitle (item) {
  return '<h3>' + item.chars + '<br><small>' + item.hw + '</small></h3>';
}

function listPub (item) {
  if (item.publication.length == 0) return '';
  var tmp = '';
  for (var i = 0; i < item.publication.length; ++i) {
    tmp = tmp + item.publication[i] + '<br>';
  }
  return '<p><b>Publications: </b><br>' + tmp + '</p>';
}

function listLink (item) {
  if (item.seealso_ref.length == 0) return '';
  var tmp = '';
  for (var i = 0; i < item.seealso_ref.length; ++i) {
    //data index should be wordid - 1, please verify
    tmp = tmp + data[item.seealso_ref[i]-1].chars + '|';
  }
  return '<p><b>See Also: </b><br>' + tmp + '</p>';

}

function getTabContent (item) {
  var tmp = '';
  for (var i = 0; i < item.wordprop.length; ++ i) {
    var curr = item.wordprop[i];
    if (curr.ps != '') {
      tmp = tmp + '<b>Part of Speech: </b><span class="ps">' + curr.ps + '</span><br>';
    }
    if (curr.apa != ''){
      tmp = tmp + '<span class="apa">' + curr.apa + '</span><br>';
    }
    if (curr.en != ''){
      tmp = tmp + '<span class="en">' + curr.en + '</span><br>';
    }
    if (curr.stch != ''){
      tmp = tmp + '<span class="stch">' + curr.stch + '</span><br>';
    }
    if (curr.df != ''){
      tmp = tmp + '<b>Definition: </b><span class="df">' + curr.df + '</span><br>';
    }
    if (curr.exchar != '') {
      tmp = tmp + '<p><b>Example: </b><br><span class="exchar">' + curr.exchar + "</span><br>" + '<span class="exrom">' + curr.exrom + '</span><br>' + '<span class="exeng">' + curr.exeng + '</span></p>';
    }
  }
  return getTabTitle(item) + tmp + listLink(item) + listPub(item);
}

function filterWordList (text) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all data, hide elements that do not contain 'text'
    for (i = 0; i < data.length; i++) {
      if ((data[i].chars + data[i].hw).indexOf(text) != -1) {
        document.getElementById('wt'+data[i].wordid).style.display = "block";
      }
      else {
        document.getElementById('wt'+data[i].wordid).style.display = "none";
      }
    }
    openTab('list');
}

function loadFile() {
  $.get("elw.json", function(_data) {
    data = _data; 
    for (var i = 0; i < data.length; ++i) {
      var item = data[i];
      //add tab
      var tabstring = '<button id="wt'+item.wordid+'" class="word_tablinks" onclick="openWord(event, \'word' + item.wordid + '\')">' + getTabTitle (item) + '</button>';
      //console.log(tabstring);
      $('#wordlist').append(tabstring);
      //add content
      var contentstring = '<div id="word'+item.wordid+'" class="word_panel">'+ getTabContent(item) + '</div>';
      //console.log(contentstring);
      $('#list').append(contentstring);
    }
  }
  );
}

