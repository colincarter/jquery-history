(function($) {
  $.history = (function() {
    
    function cleanHash(hash) {
      return hash.replace('#', '');
    }
        
    function Html5History() {
      var changeCallback;
      
      return {
        type: 'html5',
        
        init: function(callback) {
          changeCallback = callback;
          
          $(window).bind('hashchange', function() {
            console.log('hashchange', window.location.hash);
            if (changeCallback) {
              changeCallback(cleanHash(window.location.hash));
            }
          });
          
          return this;
        },
        
        back: function() {
          window.history.back();
        },
        
        forward: function() {
          window.history.forward();
        },
        
        pushState: function(url, data, title) {
          window.history.pushState(data || {}, title || '', url);
        },
        
        replaceState: function(url, data, title) {
          window.history.replaceState(data || {}, title || '', url);
        }
      };
    }
    
    function Html4History() {
      var changeCallback,  
          useIframe = $.browser.msie && parseInt($.browser.version, 10) < 8,
          iframe,
          currentHash,
          historyLength;
      
      // checks whether the hash has changed every 100ms or so
      function hashChange() {
        var changed,
            hash, frame, len;
        
        changed = false;
        
        if (useIframe) {
          frame = iframe.contentWindow.document;
          hash = cleanHash(frame.location.hash);
          
          if (hash !== '' && hash !== currentHash) {
            window.location.hash = '#' + hash;
            changed = true;
          }
          
        } else if ($.browser.webkit) {
          len = window.history.length;
          hash = cleanHash(window.location.hash);
          
          if (len !== historyLength) {
            historyLength = len;
            changed = true;
          }
        } else {
          hash = cleanHash(window.location.hash);
          
          if (hash !== currentHash) {
            changed = true;
          }
        }
        
        if (changed) {
          currentHash = hash;
          changeCallback(hash);
        }
      }
      
      return {
        type: 'html4',
        
        init: function(change) {
          var frame;
          
          changeCallback = change;
          currentHash = cleanHash(window.location.hash);
          
          if (useIframe) {
            iframe = $('<iframe id="_history" style="display:none"></iframe>').prependTo(document.body)[0];
            
            frame = iframe.contentWindow.document;
            frame.open();
            frame.close();
            frame.location.hash = '#' + currentHash;
          } else if ($.browser.webkit) {
            historyLength = window.history.length;
          }
          
          window.setInterval(hashChange, 100);
        },
        
        back: function() {
          window.history.back();
        },
        
        forward: function() {
          window.history.forward();
        },
        
        pushState: function(url, data, title) {
          var frame;
                    
          if (useIframe) {
            frame = iframe.contentWindow.document;
            frame.open();
            frame.close();
            frame.location.hash = url;
            window.location.hash = url;
          } else if ($.browser.webkit) {
            
            window.location.hash = url;
            historyLength = window.history.length;
            
          } else {
            window.location.hash = url;
          }
          
          currentHash = cleanHash(url);
        },
        
        replaceState: function() {}
      };
    }
        
    return typeof window.history !== 'undefined' && typeof window.history.pushState !== 'undefined' ?
            new Html5History() :
            new Html4History();
  }());
})(jQuery);
