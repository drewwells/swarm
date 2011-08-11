var canvas = document.getElementById('image'),
 ctx = canvas.getContext('2d'),
 canvas2 = document.getElementById('image-blur'),
 ctx2 = canvas2.getContext('2d');

var img = new window.Image();
img.src = 'amanda.jpg';
img.onload = function(){

    ctx.drawImage( img, 0, 0 );
    //ctx2.drawImage( img, 0, 0 );    
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
    var input = ctx.getImageData(0,0,img.naturalWidth,img.naturalHeight);

    var output = Blur( input,
              ctx2.getImageData(0,0,img.naturalWidth,img.naturalHeight),
              h,
              w,
              2 );

    ctx2.createImageData( output );
    ctx2.putImageData( output, 0, 0 );

return;
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

//Range
// The CanvasPixelArray contains height x width x 4 bytes of data, with index values ranging from 0 to (height x width x 4)-1.
// Column 200, Row 50
//blueComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 2];

function Blur( source, dest, height, width, radius ){

    var x,y,total = 0,
        ky,kx,
        src = source.data,
        dst = dest.data,
        h4 = height * 4,
        w4 = width * 4,
        iw4 = source.width * 4,
        buffer = 0,
        rad,
        q;


    radius = radius || 2;
    radius = radius * 4; //4 colors per pixel
    rad = Math.pow( radius * 2, 2);
    
    return BlurLine( source, dest, h4, w4, radius );
    for( y=0; y < h4; y++ ){

        for( x=0; x < w4; x++ ){

            total = 0;
            q = 0;
            for( ky = -radius; ky <= radius; ky = ky + 1 ){

                for( kx = -radius; kx <= radius; kx = kx + 4 ){

                    buffer = src[ x + kx + (y + ky ) * iw4 ];
                    total += isNaN( buffer ) ? 0 : buffer;
                    q++;
                }
            }
            //console.log( x, y, total, total/85, q );
            dst[ x + y * iw4 ] = Math.floor( total / 85 );

        }

    }
    return dest;
}

function BlurLine( source, dest, height, width, radius ){
    var y, x, kx, total, iw4 = source.width * 4,
        src = source.data, dst = dest.data;

    for( y=0; y < height; ++y ){
        total = 0;
        for( kx = -radius; kx <= radius; ++kx ){

            total += src[ kx + y * iw4 ];
        }
        dst[ 1 + y * iw4 ] = total / ( radius * 2 + 1 );

        for( x = 1; x < width; ++x ){

            total -= src[ x - radius - 1 + y * iw4 ];
            total += src[ x + radius + y * iw4 ];
            dst[ x + y * iw4 ] = total / ( radius * 2 + 1 );
        }
    }
    return dest;
}

function move( x, y, callback, increment, bitx, bity ){

    increment = increment || 30;
    callback( x + ( increment * bitx ), y + ( increment * bity ) );
}

var button = document.getElementById('blurit');
button.onclick = blurIt;
//Push button
