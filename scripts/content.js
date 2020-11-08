/*
JS file that controls the censoring
*/

// IMPORTANT =================================================================
// SLURS/SWEARS HAVE BEEN REMOVED FROM THE SOURCE CODE TO MAKE SURE NO ONE GETS OFFENDED.
const lightWords=[];
const badWords=[]; 
const slurs=[];

function replaceTextOnPage(from, to){
    getAllTextNodes().forEach(function(node){
      node.nodeValue = node.nodeValue.replace(new RegExp(quote(from), 'gi'), to);
    });
     // helper function to get text nodes
    function getAllTextNodes(){
      var result = [];    
      (function scanSubTree(node){ 
        if(node.childNodes.length) 
          for(var i = 0; i < node.childNodes.length; i++) 
            scanSubTree(node.childNodes[i]);
        else if(node.nodeType == Node.TEXT_NODE) 
          result.push(node);
      })(document);
      return result;
    }
    function quote(str){
      return (str+'').replace(/([.?*+^$[\]\\(){}|-])/gi, "\\$1");
    }
}


censorSlurs=()=>{
    for(let i=0;i<slurs.length;i++){
        let text="";
        for(let j=0;j<slurs[i].length;j++)text+="*";
        replaceTextOnPage(slurs[i],text);
    }
}

censorBad=()=>{
    for(let i=0;i<badWords.length;i++){
        let text="";
        for(let j=0;j<badWords[i].length;j++)text+="*";
        replaceTextOnPage(badWords[i],text);
    }
}

censorLight=()=>{
    for(let i=0;i<lightWords.length;i++){
        let text="";
        for(let j=0;j<lightWords[i].length;j++)text+="*";   
        replaceTextOnPage(lightWords[i],text);
    }
}


chrome.storage.sync.get('censor',(data)=>{
    if(data.censor=="all"){
        censorSlurs();
        censorBad();
        censorLight();
    }else{
        let a=data.censor.split(" ");
        for(let i=0;i<a.length;i++){
            if(a[i]=="slurs")censorSlurs();
            if(a[i]=="bad")censorBad();
            if(a[i]=="light")censorLight();
        }
    }
    chrome.storage.sync.get('blacklist',(data)=>{
        if(data.blacklist.length>0){
            for(let i=0;i<data.blacklist.length;i++){
                var text="";
                for(let j=0;j<data.blacklist[i].length;j++)text+="*";  
                replaceTextOnPage(data.blacklist[i],text);
            }
        }
    });
});


