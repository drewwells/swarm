var canvas = document.getElementById('image-blur'),
 ctx = canvas.getContext('2d');

var img = new window.Image();
img.src = 'amanda.jpg';
img.onload = function(){
    ctx.drawImage( img, 0, 0 );
    button.click();
};

var bitx = 1,
    bity = 1;

function blurIt(){

    var w = canvas.width,
        h = canvas.height,
        radius = 3,
        maxx = img.naturalWidth - radius * 2,
        maxy = img.naturalHeight - radius * 2,
        y,
        x = y = 0;

//return;
    setInterval(function(){

        move( x, y, function( newx, newy ){
            x = newx;
            y = newy;

            if( x > maxx ){

                x = maxx - ( maxx - x );
                bitx = bitx * -1;
            } else if( x < 0 ){
                x = Math.abs( x );
                bitx = bitx * -1;
            }

            if( y > maxy ) {

                x = maxx - ( maxx - x );
                bity = bity * -1;
            } else if( y < 0 ){
                y = Math.abs( y );
                bity = bity * -1;
            }
            //console.log( x, y );
            stackBlurCanvasRGB( canvas, x, y, x + 2, y + 2, radius );
        }, 50 , bitx, bity );

    }, 125);

}

function move( x, y, callback, increment, bitx, bity ){
    //console.log( x, bitx );
    //console.log( y, bity );
    increment = increment || 30;
    callback( x + ( increment * bitx ), y + ( increment * bity ) );
}

var button = document.getElementById('blurit');
button.onclick = blurIt;
//Push button
