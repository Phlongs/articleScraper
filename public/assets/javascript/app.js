$(document).ready(function(){

  // Nav Bar Mobile Slider
  $(".button-collapse").sideNav();

  // Click Listener for FORM SUBMISSION to ADD a comment
  $('.add-comment-button').on('click', function(){


    var articleId = $(this).data("id");

    // URL root (so it works in eith Local Host for Heroku)
    var baseURL = window.location.origin;

    // Get Form Data by Id
    var frmName = "form-add-" + articleId;
    var frm = $('#' + frmName);


    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/add/comment/' + articleId,
      type: 'POST',
      data: frm.serialize(),
    })
    .done(function() {
      // Refresh the Window after the call is done
      location.reload();
    });

    // Prevent Default
    return false;

  });


  // Click Listener for FORM SUBMISSION to DELETE a comment
  $('.delete-comment-button').on('click', function(){

    // Get _id of comment to be deleted
    var commentId = $(this).data("id");

    // URL root (so it works in eith Local Host for Heroku)
    var baseURL = window.location.origin;

    // AJAX Call to delete Comment
    $.ajax({
      url: baseURL + '/remove/comment/' + commentId,
      type: 'POST',
    })
    .done(function() {
      // Refresh the Window after the call is done
      location.reload();
    });

    // Prevent Default
    return false;

  });

});
