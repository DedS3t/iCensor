/*
    JS file to control what happens on the popup
*/



// Additional functions
Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};
//BLACKLIST ===============================================

document.getElementById("viewBlackList").addEventListener('click',(e)=>{
    chrome.storage.sync.get("blacklist",(data)=>{
        var text="Your BlackList is: ";
        for(let i=0;i<data.blacklist.length;i++)text+=` \"${data.blacklist[i]}\" `;
        alert(text);
    });
});

document.getElementById("addBlackList").addEventListener('click',(e)=>{
    var ele=document.getElementById("blacklist");
    var word=ele.value;
    if(word!=undefined && word.length>0){
        chrome.storage.sync.get("blacklist",(data)=>{
            data.blacklist.push(word);
            ele.value="";
            chrome.storage.sync.set({blacklist:data.blacklist},()=>{
                chrome.tabs.getSelected(null, function(tab) {
                    var code = 'window.location.reload();';
                    chrome.tabs.executeScript(tab.id, {code: code});
                  });
            });
        });
    }
});

document.getElementById("removeBlackList").addEventListener('click',(e)=>{
    var ele=document.getElementById("blacklist");
    var word=ele.value;
    if(word!=undefined && word.length>0){
        chrome.storage.sync.get("blacklist",(data)=>{
            data.blacklist.remove(word);
            ele.value="";
            chrome.storage.sync.set({blacklist:data.blacklist},()=>{
                chrome.tabs.getSelected(null, function(tab) {
                    var code = 'window.location.reload();';
                    chrome.tabs.executeScript(tab.id, {code: code});
                  });
            });
        });
    }
});

styling=()=>{
    $("#update").addClass("btn btn-primary but"); 
}

update=()=>{

    var slurs=$("input[name='slurs']");
    var bad=$("input[name='bad']");
    var light=$("input[name='light']");
    //document.getElementById("error").innerHTML=`Slurs: ${slurs} and bad ${bad} and light ${light}`;
    if(slurs!=undefined && bad!=undefined && light!=undefined){
        var text="";
       
        if(slurs.is(':checked') && bad.is(':checked') && light.is(':checked')){
            text="all";
            chrome.storage.sync.set({censor:text},()=>{
                chrome.tabs.getSelected(null, function(tab) {
                    var code = 'window.location.reload();';
                    chrome.tabs.executeScript(tab.id, {code: code});
                    window.close();
                });
            });
        }else{
            if(slurs.is(':checked'))text+="slurs ";
            if(bad.is(':checked'))text+="bad ";
            if(light.is(':checked'))text+="light ";
            if(text.charAt(text.length-1)==" ")text=text.slice(0,-1);
            
            chrome.storage.sync.set({censor:text},()=>{
                chrome.tabs.getSelected(null, function(tab) {
                    var code = 'window.location.reload();';
                    chrome.tabs.executeScript(tab.id, {code: code});
                    window.close();
                  });
            });
        }
    }else{
        document.getElementById("error").innerHTML="There was an error ):";
    }
};

chrome.storage.sync.get('censor',(data)=>{
    var state=data.censor;
    if(state=="all"){
        document.getElementById("curr").innerHTML="Currently Censoring all words";
        $("form").append("<input type='checkbox' name='slurs' value='slurs' checked><label for='slurs'>Slurs</label><br><input type='checkbox' name='bad' value='bad' checked><label for='bad'>Bad Swears</label><br><input type='checkbox' name='light' value='light' checked><label for='light'>light Swears</label><br><input type='button' id='update' value='Update Config'>");
        document.getElementById("update").addEventListener('click',(event)=>{
            update();
        });
        styling();
    }else{
        var a=state.split(" ");
        var ele=document.getElementById("curr");
        ele.innerHTML="Currently Censoring: ";
        var formText="";
        var s=false,l=false,b=false;
        for(let i=0;i<a.length;i++){
        
            if(a[i]=="slurs"){
                s=true;
                formText+="<input type='checkbox' name='slurs' value='slurs' checked><label for='slurs'>Slurs</label><br>";
                ele.innerHTML=ele.innerHTML+"Slurs ";
            }else if(a[i]=="light"){
                l=true;
                formText+="<input type='checkbox' name='light' value='light' checked><label for='light'>light Swears</label><br>";
                ele.innerHTML=ele.innerHTML+"Light Swears ";
            }else if(a[i]=="bad"){
                b=true;
                formText+="<input type='checkbox' name='bad' value='bad' checked><label for='bad'>Bad Swears</label><br>";
                ele.innerHTML=ele.innerHTML+"Bad Swears ";
            } 
        }
        if(!s){
            formText+="<input type='checkbox' name='slurs' value='slurs'><label for='slurs'>Slurs</label><br>";
        }
        if(!l){
            formText+="<input type='checkbox' name='light' value='light'><label for='light'>light Swears</label><br>";
        }
        if(!b){
            formText+="<input type='checkbox' name='bad' value='bad'><label for='bad'>Bad Swears</label><br>";
        }
        if(ele.innerHTML=="Currently Censoring: "){
            ele.innerHTML="Currently Censoring: nothing";
        }
       
        formText+="<input type='button' id='update' value='Update Config'>";
        $("form").append(formText);
        document.getElementById("update").addEventListener('click',(event)=>{
            update();
        });
        styling();
    }


});
