
			
			$(document).ready(function () {
              
				
					
    $('[data-toggle="tooltip"]').tooltip(); 
			
			
				
				(function($) {

        'use strict';

        window.sr= new scrollReveal({
          reset: true,
          move: '50px',
          mobile: true
        });

      })();
	  
	  $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
        });
        // scroll body to 0px on click
        $('#back-to-top').click(function () {
            $('#back-to-top').tooltip('hide');
            $('body,html').animate({
                scrollTop: 0
            }, 1000);
            return false;
        });
        
        $('#back-to-top').tooltip('show');
	
	
	//For accordin icons  up and down  
	  $('.collapse').on('shown.bs.collapse', function(){
$(this).parent().find(".fa-chevron-down").removeClass("fa-chevron-down").addClass("fa-chevron-up");

}).on('hidden.bs.collapse', function(){
$(this).parent().find(".fa-chevron-up").removeClass("fa-chevron-up").addClass("fa-chevron-down");
});
	  
$('div.Dummy_data  > input:checkbox').change(function () {

  if ($(this).is(":checked")) {
      $(this).closest("#DataUpload").addClass('disable_area');
      $(".sanity_btn").show();
  }
  else {
      $(this).closest("#DataUpload").removeClass('disable_area');
  };
});	

$(".confirm_chck").click(function(){
  $(".pass_msg").show();
  $("#DataUpload").removeClass('in');
  $("#Dummy_data").prop("checked", false);
  $("#DataUpload").removeClass('disable_area');
  $(".sanity_btn").hide();
  $(".cal_pending").show();
});

$(".Calculate_btn").click(function(){
  $(".cal_pending").hide();
  $(".cal_pass").show();
  $("#Calculation").removeClass('in');
  $(".download_output").show();
  
   
});




				
            });
			
			
		
		
		
		
