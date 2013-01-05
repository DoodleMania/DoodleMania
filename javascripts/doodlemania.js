function Watermark( inputs, opts ){
	var _i = [];
	var opts = opts || {watermarkColor: '#e7e7e7', placeholderColor: '#ccc' };
	var placeholderSupport = ('placeholder' in document.createElement('input'));
	
	if ( typeof inputs == 'object'){
		if( inputs.jquery ) {
			_i = inputs.toArray();		
		}else if( inputs.constructor == Array ){
			_i = inputs;	
		}else{
			_i.push( inputs );
		}		
	}
	
	var rewind = function(i){
		setTimeout( function(){ setSelectionRange(i,0,0); }, 0);
	}
	
	var mark = function(i){	
		
		rewind( i );
		disableSelect( i );
		i.value = attr( i ,'placeholder' );
		i.style.color = opts.watermarkColor;
		i.watermarked = true;
		i.className += ' watermarked';
	}
	
	var unmark = function(i){				
		i.value = '';
		i.style.color = '';
		i.watermarked = false;
		i.className = i.className.replace(' watermarked','');
		enableSelect( i );
	}
	
	var focus = function(e){
		if(this.value == '' || this.placeheld ){
			mark( this );
		}else if( this.watermarked == true ){
			unmark( this );
		}
	}
	
	var blur = function(e){
		
		if( this.value == attr( this ,'placeholder' ) ){
			unmark( this );
			if( !placeholderSupport ){
				placehold( this );
			}
		}
	}
	
	var key = function(evt){
		
		var e = (evt) ? evt : window.event;
		var ctrlKeys = /37|38|39|40/.test(e.keyCode);
		
		enableSelect( this );
		
		if( ctrlKeys && this.watermarked ){
			e.preventDefault();
			disableSelect( this );
			return true;
		}		
		
		if( this.watermarked ){
			unmark( this );
			unPlacehold( this );
		}		
	}
	
	var keyUp = function(e){
		if( this.value == '' ){
			mark( this );
		}
	}
	
	var mouse = function(e){
		if( this.placeheld || this.watermarked ){
			e.preventDefault();
			rewind( this );
		}
		return false;
	}

	var placehold = function( i ){
		
		if( i.value == '' || i.value == attr( i ,'placeholder') ){
			disableSelect( i );
			i.value 			= attr( i ,'placeholder' );
			i.style.color = opts.placeholderColor;
			i.placeheld 	= true;
			i.className += ' placeheld';
		}
	}
	
	var unPlacehold = function( i ){
		enableSelect( i );
		i.value 			= '';
		i.style.color = '';
		i.placeheld 	= false;
		i.className = i.className.replace(' placeheld','');
	}
	
	var unload = function(e){
		for(var i = 0, o; o = _i[i]; ++i){
			if( o.watermarked ){
				unmark( o );	
			}
			if( o.placeheld ){
				alert.log( o.value );
				unPlacehold( o );
			}
		}
	}
	
	var listen = function(e, o, f) {
		if (o.addEventListener){
			o.addEventListener(e,f,false);
		}else if (o.attachEvent) {
			var r = o.attachEvent("on"+e, function(){ f.call(o); });
			return r;
		}
	}
	
	function setSelectionRange(i, s, e) { 
    if (i.setSelectionRange) { 
        i.focus(); 
        i.setSelectionRange(s, e); 
    } else if (i.createTextRange) { 
        var r = i.createTextRange(); 
        r.collapse(true); 
        r.moveEnd('character', e); 
        r.moveStart('character', s); 
        r.select(); 
    } 
	}
	
	var attr = function( o, a ){
		var result = (o.getAttribute && o.getAttribute(a)) || null;
    if( !result ) {
        var attrs = o.attributes;
        if( attrs ){
	        var length = attrs.length;
	        for(var i = 0; i < length; i++){
						if(attrs[i].nodeName === a){
						    result = a[i].nodeValue;
						}
	        }
        }
    }
    return result;	
	}
	
	var disableSelect = function( o ){
 		o.onselectstart = function(){return false};
		o.style.MozUserSelect = o.style.WebkitUserSelect = o.style.UserSelect =  'none';
	}
	
	var enableSelect = function( o ){
		o.onselectstart = null;
		o.style.MozUserSelect = o.style.WebkitUserSelect = o.style.UserSelect =  '';
	}

	
	for(var i = 0, o; o = _i[i]; ++i){
		listen( 'focus', o, focus );
		listen( 'blur', o, blur );
		listen( 'keypress', o, key );
		listen( 'keyup', o, keyUp );
		listen( 'mousedown', o, mouse );
		listen( 'mouseup', o, mouse );
		listen( 'mouseup', o, mouse );

		//If no native support for placeholder, mimic it
		if( !placeholderSupport ){
			placehold( o );
		}		
		
		
	}
 	
}

(function($){

	function Project( $li, opts ){
	    
	    var self = this;
	    var next, prev, list, current, first, last;	
		
	    this.ob = $li;
	    
	    this.next = function(){ 
	        current = current.next().length>0? current.next() : current;   
					update();
	    }
	
	    this.prev = function(){
	        current = current.prev().length>0? current.prev() : current;
	        update();
	    }
	
	    function update(){
	        list.find('li').removeClass('current');
	        current.addClass('current'); 
	 				list.animate({left:(-(self.ob.width()*current.index())) + 'px'},300);    
	 				
	 				if( current.is(':last-child') ){
	 					next.addClass('disabled');
	 					prev.removeClass('disabled');
	 				}
	 				if( current.is(':first-child') ){
	 					prev.addClass('disabled');
	 					next.removeClass('disabled');	 					
	 				}
	 				
	    }
	
	    function nextClick(e){
	        e.preventDefault(); 
	        self.next();
	    }
	
	    function prevClick(e){    
	        e.preventDefault(); 
	        self.prev();
	    }
	    
	    function init(){
	        
	        next = self.ob.find('nav .next');
	        prev = self.ob.find('nav .prev');
	        list = self.ob.find('>ul');
	        current = list.find('>li:first-child');
	        first = current;
	        last = list.find('>li:last-child');
	        next.unbind().bind('click', nextClick );
	        prev.unbind().bind('click', prevClick ); 
	        
	        console.log(current);	                        
	    
	    };   
	    
	    init(); 
	}

	
	var Kerem = {
			
			_$header: null,
			_$contact: null,		
			setupContact: function(){
				
				this._$contact = $('section.contact');
				this._$contact.find('form').submit( this.contact );
				
				//Watermark
				Watermark( this._$contact.find('textarea,input'), {watermarkColor: '', placeholderColor: ''} );
				
				//enable counts
				this._$contact.find('fieldset.message textarea')
					.keypress( this.contactMessageChanged )
					.click( this.contactMessageChanged  );
			
			},
			
			contactMessageChanged: function(e){
				
				var $m = $(this);
				var $count = $m.siblings('.count');
				var limit = parseInt($m.attr('maxlength'),10);
				var k = e.keyCode;
				var len = (this.watermarked? 0 : this.value.length);
				
				if( len >= limit && $.inArray(k,[8,46,37,38,39,40,9]) == -1 ){
					e.preventDefault();
				}
				$count.text( limit - len );
				
				
			},
			
			isEmail: function( address ){

				return /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/ig.test( address );
	
			},
			
			contact: function(e){
				
				$req = $(this).find('.required');
				$req.each( 
					function(){ 
						if( this.placeheld || this.watermarked || /([^\s])/.test( this.value ) != true || (this.name == 'email' && !Kerem.isEmail( this.value )) ){
							$(this).addClass('invalid');
						}else{
							$(this).removeClass('invalid');
						}
					} 
				);

				//always prevent from a normal submit
				e.preventDefault();								
				
				if( $req.filter('.invalid').length < 1 ){
					Kerem.contactSubmit();					
				}						
				
			},
			
			contactSubmit: function(){
				
				var $f = this._$contact.find('form');
				
				//Add in the honeypot
				$f.append(
					$('<input/>').attr({name:'pwn', value: '1337',type:'hidden'})
				);
				
				$.post(
					"e.php",
					$f.serialize(),
					function(data){
		   		}
		   	);
				
				//UX
				this.pinHeader();
				this._$contact.addClass('step2');
				
				//UX for send progress
				var $p = this._$contact.find('.step2 .progress .bar').css({width: '50%'});
				setTimeout( function(){ $p.css({width: '100%'}); }, 1000 );
				setTimeout( function(){ Kerem._$contact.addClass('step3'); }, 3000 );	
				setTimeout( 
					function(){ 
						Kerem._$contact
							.removeClass('step3 step2')
							.find('form').get(0).reset(); 
						$p.css({width:0});  
						Kerem.unpinHeader();
					}, 
					5500 
				);				
				
			},
			
			setupBindings: function(){
				this._$header = $('body>header');
			},
			
			pinHeader: function(){
				this._$header.addClass('pinned');		
			},
			
			unpinHeader: function(){
				this._$header.removeClass('pinned');
			},
					
			setupHeader: function(){
				
				$(document).scroll(
					function(){
						if( $(document).scrollTop() > 30 ){
							Kerem.pinHeader();
						}else{
							Kerem.unpinHeader();
						}
					}
				);
				
			},	
			
			setupFitBitStats: function(){
			$.getJSON("http://www.nicholasleby.com/public/Kerem/keremFitBit.php", function(json) 
  {
$('.name-spelling').html('<dt>Total Lifetime Distance</dt><dd><em class="number">' + parseInt(parseInt(json.lifetime.total.distance)*0.6214) + '</em> miles</dd>');});
			 },



			setupFooter: function(){
$.getJSON("http://twitter.com/status/user_timeline/kerem.json?count=10&callback=?",function(data)
{
 $('.twitter_status').html(data[0].text);
 $('.time').html(Kerem.timeAgo(data[0].created_at));
});



},			

timeAgo: function(dateString) {
        var rightNow = new Date();
        var then = new Date(dateString);
         
        if ($.browser.msie) {
            // IE can't parse these crazy Ruby dates
            then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
        }
 
        var diff = rightNow - then;
 
        var second = 1000,
        minute = second * 60,
        hour = minute * 60,
        day = hour * 24,
        week = day * 7;
 
        if (isNaN(diff) || diff < 0) {
            return ""; // return blank string if unknown
        }
 
        if (diff < second * 2) {
            // within 2 seconds
            return "right now";
        }
 
        if (diff < minute) {
            return Math.floor(diff / second) + " seconds ago";
        }
 
        if (diff < minute * 2) {
            return "about 1 minute ago";
        }
 
        if (diff < hour) {
            return Math.floor(diff / minute) + " minutes ago";
        }
 
        if (diff < hour * 2) {
            return "about 1 hour ago";
        }
 
        if (diff < day) {
            return  Math.floor(diff / hour) + " hours ago";
        }
 
        if (diff > day && diff < day * 2) {
            return "yesterday";
        }
 
        if (diff < day * 365) {
            return Math.floor(diff / day) + " days ago";
        }
 
        else {
            return "over a year ago";
        }
    },
            
            setupProjects: function(){
				
				$('ul.projects>li').each( function(){ 
					
					new Project( $(this) );	
							
				});
			},				
					
			init: function( loaded ){
				
				if( loaded ){
					this.setupContact();
				}
				
				$(document).ready( function(){
					Kerem.setupFitBitStats();
					Kerem.setupFooter();
					Kerem.setupBindings();
					Kerem.setupHeader();
					Kerem.setupProjects();				
				});
				
				$(window).load(function(){
						Kerem.init( true );
				});
				
			}
	};
	
	Kerem.init();


}(jQuery));

