$('#main').live('pagebeforeshow', function(event,data) {
    if(data.prevPage.length>0) return;
    if(navigator.splashscreen) navigator.splashscreen.hide();
});

$('#main').live('pageshow', function(event,data) {
    if(data.prevPage.length>0) return;
    setTimeout(function() {
    $.mobile.loading('show');
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
        $.mobile.loading('hide');
    });
    }, 1000);
});

$('#thread').live('pagebeforeshow', function(event,data) {
    $('#thread ul').empty();
    $('#thread h1').empty();
});

$('#thread').live('pageshow', function(event,data) {
    var mid=$.mobile.pageData.mid;
    if(!mid) {
        return;
    }

    $.mobile.loading('show');
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
        $.mobile.loading('hide');
    });
});

function juickFormatText(txt) {
    txt=txt.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
    txt=txt.replace(/\n/g,"<br/>");
    return txt;
}
