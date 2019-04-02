(function () {
    var bookmarksContent = [];
    chrome.tabs.query({},function(tabs){     
        tabs.forEach(function(tab){
            bookmarksContent.push(tab.url+";");
            // bookmarksContent.push(tab.url+"  "+tab.title);
        });
    });

    var textFile = null;
    var makeTextFile = function (text) {
        const exportData = text.toString().replace(/,/g, '\n');
        const data = new Blob([exportData], {type: 'text/csv;charset=utf-8;'});
        if (textFile !== null) {
          window.URL.revokeObjectURL(textFile);
        }
        textFile = window.URL.createObjectURL(data);
        return textFile;
    };
    
    var create = document.getElementById('create');

    create.addEventListener('click', function () {
        var link = document.getElementById('downloadlink');
        link.href = makeTextFile(bookmarksContent);
        link.style.display = 'block';
    }, false);

    if (window.File && window.FileReader && window.FileList && window.Blob) {
        var openTabs = document.getElementById('openTabs');

        openTabs.addEventListener('click', function () {
            var file = document.querySelector('input[type=file]').files[0];
            var reader = new FileReader()
   
            reader.onload = function (event) {
                var contentRead = event.target.result.split(";");
                var tabN = 0;
                var tabEnd = contentRead.length - 1;
                for(tabN = 0; tabN < tabEnd; tabN++) {
                    chrome.tabs.create({ url:  contentRead[tabN] });
                }
            }

            reader.readAsText(file);
        }, false);
    }
})();