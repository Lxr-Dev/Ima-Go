$(function() {
  // Post Toggle View
  $('#post-comment').hide();
  $('#btn-toggle-comment').click(e => {
    e.preventDefault();
    $('#post-comment').slideToggle();
  });
  
  // Like Button Request, reemplazar según la respuesta del servidor
  $('#btn-like').click(function(e) {
    e.preventDefault();
    let imgId = $(this).data('id');
    console.log(imgId)
    $.post('/images/' + imgId + '/like')
      .fail(data => {
        window.location.replace("/auth/signin");
      })
      .done(data => {
      console.log('back:', data)
        $('.likes-count').text(data.likes);
      });
  });

  // Delete Button Request
  $('#btn-delete').click(function (e) {
    e.preventDefault();
    let $this = $(this);
    const response = confirm('Estas seguro de que deseas eliminar esta imagen?');
    if (response) {
      let imgId = $(this).data('id');
      $.ajax({
        url: '/images/' + imgId,
        type: 'DELETE'
      })
        .done(function(result) {
          $this.removeClass('btn-danger').addClass('btn-success');
          $this.find('i').removeClass('fa-times').addClass('fa-check');
          $this.append('<span>Deleted!</span>');
          window.location.replace("/");
        });
    }
  });
});
