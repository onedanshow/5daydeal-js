var charity_value_last = 0;
var charity_ajax_request_count = 0;
var charity_ajax_request_delta = 900000; // 15 min
var charity_ajax_request_max = 100;
var charity_hour_denominator = 15;
var charity_initial_animation_speed = 1;

function charity_ticker_driver(charity_ticker_start, charity_ticker_end, charity_ticker_current, charity_ticker_walk){

  var charity_ticker_step_size = Math.ceil( (charity_ticker_end - charity_ticker_start) / charity_hour_denominator );
  var delta = 1000 * charity_hour_denominator;
  if( charity_ticker_current == 0 ){
    charity_ticker_current = charity_ticker_start;
    charity_ticker_walk = charity_ticker_start;
  }
  charity_ticker_walk = charity_ticker_walk + charity_ticker_step_size;

  //console.log("Charity driver: min_charity_ticker_start_size = " + charity_min_step_size + " , charity_ticker_start = " + charity_ticker_start + " , charity_ticker_end = " + charity_ticker_end + " , charity_ticker_current = " + charity_ticker_current + " , charity_ticker_walk = " + charity_ticker_walk + " , charity_ticker_step_size = " + charity_ticker_step_size + " step time delta =  " + ( delta / 1000 ) );

  if(
    charity_ticker_current < charity_ticker_end
    && charity_ticker_walk <= charity_ticker_end
  ){

    if( ( charity_ticker_walk - charity_ticker_current ) > charity_min_step_size ){

      charity_ticker_animate( charity_ticker_current, charity_ticker_walk );
      charity_ticker_current = charity_ticker_walk;
    }
    setTimeout( function(){	charity_ticker_driver(charity_ticker_start, charity_ticker_end, charity_ticker_current, charity_ticker_walk); }, 60000);
  }	else if(
    charity_ticker_current < charity_ticker_end
    && charity_ticker_walk > charity_ticker_end
  ){

    charity_ticker_animate( charity_ticker_current, charity_ticker_end );
  }

}

function get_recent_charity(){
  if(charity_ajax_request_count > charity_ajax_request_max ) return

  jQuery.ajax({
    url: '/charity_counter',
    method: "GET",
    dataType: "JSON"
  })
  .done( function( response ){
    console.log(response);

    // jQuery('.charity_box .total').attr( 'i', charity_ajax_request_count);
    if( charity_value_last != response.charity_total){
      if(response.charity_prev == 0){
        jQuery('#charity_total').html( response.charity_prev );
      }
      else{
        runCounter(response.charity_prev, response.charity_total)
      }
      charity_ticker_driver( response.charity_prev, response.charity_total, 0, 0);
      charity_value_last = response.charity_total;
    }
    charity_ajax_request_count++;
    setTimeout( function(){ get_recent_charity(); }, charity_ajax_request_delta );
  })
}

jQuery(document).ready( function (){
  charity_ajax_request_count = 0;
  get_recent_charity();
});
