$('#main').live('pageshow', function(event) {
    $('#main ul').empty();

    $.mobile.showPageLoadingMsg();
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    $.getJSON("http://api.juick.com/messages",function(data) {
        $.each(data, function(i,item) {
            var html='<li data-icon="false"><a href="#thread?mid='+item.mid+'">';
            html+='<img src="http://i.juick.com/as/'+item.user.uid+'.png"/>';
            html+='<h3>@'+item.user.uname+':';
            if(item.tags) {
                for(var i=0; i<item.tags.length; i++) {
                    html+=' *'+item.tags[i];
                }
            }
            html+='</h3><p>'+juickFormatText(item.body)+'</p></a></li>';
            $('#main ul').append(html);
        });
        $('#main ul').listview('refresh');
        $.mobile.hidePageLoadingMsg();
    });
});

$('#thread').live('pageshow', function(event,data) {
    var mid=getParameterByName("mid");
    if(!mid) {
        return;
    }

    $('#thread ul').empty();
    $('#thread h1').empty();

    $.mobile.showPageLoadingMsg();
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;

    $.getJSON("http://api.juick.com/thread?mid="+mid,function(data) {
        var title=false;
        $.each(data, function(i,item) {
            if(!title) {
                $('#thread h1').append('@'+item.user.uname);
                title=true;
            }
            var html='<li>';
            html+='<img src="http://i.juick.com/as/'+item.user.uid+'.png"/>';
            html+='<h3>@'+item.user.uname+':';
            if(item.tags) {
                for(var i=0; i<item.tags.length; i++) {
                    html+=' *'+item.tags[i];
                }
            }
            html+='</h3><p>'+juickFormatText(item.body)+'</p></li>';
            $('#thread ul').append(html);
        });
        $('#thread ul').listview('refresh');
        $.mobile.hidePageLoadingMsg();
    });
});

function juickFormatText(txt) {
    txt=txt.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
    txt=txt.replace(/\n/g,"<br/>");
    return txt;
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if(results == null) {
        return null;
    } else {
        return decodeURIComponent(results[1].replace(/\+/g, " "));
    }
}
