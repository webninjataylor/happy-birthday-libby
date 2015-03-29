/****************************/
/******** LOAD STATE ********/
/****************************/
var wnt = {};
wnt.currentDate = new Date();
$(function(){
    var introState = localStorage.getItem('intro');
    if((introState === 'true')||(introState === null)){
        $('.intro').show();
    }
    var releaseCheck = setInterval(function(){
    	console.log('CHECKING ...');
    	wnt.currentDate = new Date();
    	var release,
    	    flag;
    	$.each($('.card'),function(){
    		$flag = $(this).find('.flag');
    		release = new Date($flag.data('release'));
    		if((release < wnt.currentDate)&&($flag.attr('src') === 'rampant.jpg')){   // LESS THAN dates are in the PAST ... why is one undefined?!?!?!
	    		$flag.attr('src','cross.jpg');
		}
    	});
    }, 60000);
    
    /* COUNTDOWN */
    var end = new Date('11/01/2014 12:00 AM');
    var _second = 1000;
    var _minute = _second * 60;
    var _hour = _minute * 60;
    var _day = _hour * 24;
    var timer;
    function showRemaining() {
        var now = new Date();
        var distance = end - now;
        if (distance < 0) {
            clearInterval(timer);
            $('#countdown').hide();
            return;
        }
        var days = Math.floor(distance / _day);
        var hours = Math.floor((distance % _day) / _hour);
        var minutes = Math.floor((distance % _hour) / _minute);
        var seconds = Math.floor((distance % _minute) / _second);
        $('#countdown').html(days+'d:'+hours+'h:'+minutes+'m:'+seconds +'s');
    }
    timer = setInterval(showRemaining, 1000);
    
});



/*****************************/
/******** INTRO MODAL ********/
/*****************************/
$('.close').click(function(){
	$('.intro').hide();
	$('.peeking').hide();
    localStorage.setItem('intro',false);
});
$('.open').click(function(){
	$('.intro').show();
    localStorage.setItem('intro',true);
});



/****************************/
/******** CARD FLIPS ********/
/****************************/
$(document).on('click', '.flag', function(){
    if($(this).attr('src') === 'rampant.jpg'){
    	$('.peeking').show();
        return;
    }
	$(this).hide();
	$(this).siblings('.year').show();
});
$(document).on('click', '.card', function(){
    if($(this).find('.flag').attr('src') === 'rampant.jpg'){
        return;
    }
	$(this).find('.factoid').toggle();
    $(this).find('.year').toggle();
    $(this).find('.libby').attr('src',$(this).find('.libby').data('src'));
    localStorage.setItem($(this).find('.libby').data('src'),"viewed");
});



/****************************/
/******** LOAD CARDS ********/
/****************************/
$.getJSON('content.json?cachebust=1', function(data) {
    var flag,
        release,
        viewed;
    $.each(data.cards, function(){
    	
    	/* Initial flag is Rampant Lion, then timed release of St Andrew's Cross */
    	flag = 'rampant.jpg';
        release = new Date(this.release);
        
        if(release < wnt.currentDate){   // LESS THAN dates are in the PAST
	    flag = 'cross.jpg';
	}
	
	viewed = localStorage.getItem(this.photo);
	
	$card = $('<div class="card"><img src="'+flag+'" class="flag" data-release="'+this.release+'"><div class="factoid">'+this.factoid+'</div><img src="" data-src="'+this.photo+'" class="libby"><div class="year">'+this.year+'</div></div>');
	
	$('.cards').append($card);
	
	if(viewed === 'viewed'){
        	$card.find('.flag').trigger('click');
        	$card.trigger('click');
        }
    });
});