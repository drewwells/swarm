var canvas = document.getElementById('image'),
 ctx = canvas.getContext('2d'),
 canvas2 = document.getElementById('image-blur'),
 ctx2 = canvas2.getContext('2d');

var img = new window.Image();
//img.src = 'amanda.jpg';
img.src = 'img00.gif';
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
                       //RETARD
                       //h,
                       //w,
                       img.naturalHeight,
                       img.naturalWidth,
                       2 );

    ctx2.createImageData( output );
    ctx2.putImageData( output, 0, 0 );

    return;
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
        r4 = radius * 4,
        //iw4 = source.width * 4,
        buffer = 0,
        rad,
        q;

    radius = radius || 2;
    //radius = radius * 4; //4 colors per pixel
    rad = Math.pow( radius * 2 + 1, 2);

    return BlurLine( source, dest, height, w4, radius );
    for( y=0; y < h4; y++ ){

        for( x=0; x < w4; x++ ){

            total = 0;
            q = 0;
            for( ky = -radius; ky <= radius; ky++ ){

                for( kx = -r4; kx <= r4; kx++ ){

                    buffer = src[ x + kx + (y + ky ) * w4 ];
                    total += isNaN( buffer ) ? 0 : buffer;
                    q++;
                }
            }
            //console.log( x, y, total, total/85, q );
            dst[ x + y * w4 ] = Math.floor( total / 85 );

        }

    }
    return dest;
}

function BlurLine( source, dest, height, width, radius ){
    var y, x, kx, total,
        src = source.data, dst = dest.data,
        r4 = radius * 4,
        ty,
        divide = r4 * 2 + 1,//q getting 16, this is 17
        t1,t2,t3,t4,
        buffer;

    for( y = 40; y < 41; y++ ){

        t1 = t2 = t3 = t4 = 0;
        for( kx = -r4; kx < r4; kx = kx + 4 ){

            //total += src[ kx + y * width ]; 
            buffer = src[ kx + y * width ];
            t1 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ kx + y * width + 1 ];
            t2 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ kx + y * width + 2 ];
            t3 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ kx + y * width + 3 ];
            t4 += isNaN( buffer ) ? 0 : buffer;
        }

        dst[ y * width ] = Math.floor( t1 / 4 );
        dst[ y * width + 1 ] = Math.floor( t2 / 4 );
        dst[ y * width + 2 ] = Math.floor( t3 / 4 );
        //dst[ y * width + 3 ] = Math.floor( t4 / 4 );

        ty = y * width;
        for( x = 0; x < width; x = x + 4 ){


            buffer = src[ x - r4 + ty ];
            t1 -= isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x + r4 + ty ];
            t1 += isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x - r4 + ty + 1 ];
            t2 -= isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x + r4 + ty + 1 ];
            t2 += isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x - r4 + ty + 2 ];
            t3 -= isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x + r4 + ty + 2 ];
            t3 += isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x - r4  + ty + 3 ];
            t4 -= isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x + r4 + ty + 3 ];
            t4 += isNaN( buffer ) ? 0 : buffer;

//console.log( t1, t1/divide );
            dst[ x + y * width ] = Math.floor( t1 / 4 );
            dst[ x + y * width + 1 ] = Math.floor( t2 / 4 );
            dst[ x + y * width + 2 ] = Math.floor( t3 / 4 );
            console.log( t1, t2, t3 );
            //dst[ x + y * width + 3 ] = Math.floor( t4 / divide );

        }

    }
    //console.log( dest );
    return dest;
}

function move( x, y, callback, increment, bitx, bity ){

    increment = increment || 30;
    callback( x + ( increment * bitx ), y + ( increment * bity ) );
}

var button = document.getElementById('blurit');
button.onclick = blurIt;
//Push button
