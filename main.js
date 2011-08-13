var canvas = document.getElementById('image'),
 ctx = canvas.getContext('2d'),
 canvas2 = document.getElementById('image-blur'),
 ctx2 = canvas2.getContext('2d');

var img = new window.Image();
img.src = 'amanda.jpg';
//img.src = 'img00.gif';
img.onload = function(){

    ctx.canvas.width = ctx2.canvas.width = this.naturalWidth;
    ctx.canvas.height = ctx2.canvas.height = this.naturalHeight;
    ctx.drawImage( img, 0, 0 );
    ctx2.drawImage( img, 0, 0 );  
    button.click();
};

var bitx = 1,
    bity = 1;

function blurIt(){

    var w = canvas.width,
        h = canvas.height,
        radius = 3,
        y,
        x = y = 0;

    var output = Blur( ctx.getImageData(0,0,img.naturalWidth,img.naturalHeight),
                       ctx2.getImageData(0,0,img.naturalWidth,img.naturalHeight),
                       3 );

    ctx2.putImageData( output, 0, 0 );

    return;
}

//Range
// The CanvasPixelArray contains height x width x 4 bytes of data, with index values ranging from 0 to (height x width x 4)-1.
// Column 200, Row 50
//blueComponent = imageData.data[((50*(imageData.width*4)) + (200*4)) + 2];

function Blur( source, dest, radius, x, y ){

    var x,y,total = 0,
        ky,kx,
        src = source.data,
        dst = dest.data,
        width = source.width,
        height = source.height,
        r4 = radius * 4,
        buffer = 0,
        rad,
        q;

    radius = radius || 2;
    rad = Math.pow( radius * 2 + 1, 2);
    return BlurLine( BlurVert(  source, dest, radius ), dest, radius );
}

function BlurVert( source, dest, radius ){
    var y, x, ky, total,
        src = source.data, dst = dest.data,
        width = source.width,
        height = source.height,
        w4 = width * 4,
        r4 = radius * 4,
        rw = radius * w4,
        ty,
        divide = radius * 2 + 1,
        t1,t2,t3,t4,
        buffer;

    for( x = 0; x < w4; x = x + 4 ){

        t1 = t2 = t3 = t4 = 0;
        for( ky = 0; ky <= radius; ky++ ){

            buffer = src[ x + ky * w4 ];
            t1 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ x + ky * w4 + 1 ];
            t2 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ x + ky * w4 + 2 ];
            t3 += isNaN( buffer ) ? 0 : buffer;
            //buffer = src[ x + ky * w4 + 3 ];
            //t4 += isNaN( buffer ) ? 0 : buffer;
        }

        dst[ x ] = Math.floor( t1 / (radius + 1) );
        dst[ x + 1 ] = Math.floor( t2 / (radius + 1) );
        dst[ x + 2 ] = Math.floor( t3 / (radius + 1) );
        //dst[ x + 3 ] = Math.floor( t4 / (radius + 1) );

        for( y = 0; y < height; y++ ){

            ty = y * w4;
            buffer = src[ x - rw + ty ];
            t1 -= isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x + rw + ty ];
            t1 += isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x - rw + ty + 1 ];
            t2 -= isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x + rw + ty + 1 ];
            t2 += isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x - rw + ty + 2 ];
            t3 -= isNaN( buffer ) ? 0 : buffer;

            buffer = src[ x + rw + ty + 2 ];
            t3 += isNaN( buffer ) ? 0 : buffer;

            // buffer = src[ x - rw  + ty + 3 ];
            // t4 -= isNaN( buffer ) ? 0 : buffer;

            // buffer = src[ x + rw + ty + 3 ];
            // t4 += isNaN( buffer ) ? 0 : buffer;

            dst[ x + y * w4 ] = Math.floor( t1 / divide );
            dst[ x + y * w4 + 1 ] = Math.floor( t2 / divide );
            dst[ x + y * w4 + 2 ] = Math.floor( t3 / divide );
            //dst[ x + y * w4 + 3 ] = Math.floor( t4 / divide );
        }
        
    }

    return dest;
}

function BlurLine( source, dest, radius ){
    var y, x, kx, total,
        w4 = width * 4,
        src = source.data, dst = dest.data,
        height = source.height,
        width = source.width,
        r4 = radius * 4,
        ty,
        divide = radius * 2 + 1,
        //d4 = r4 * 2 / 4 + 1,
        t1,t2,t3,t4,
        buffer;

    for( y = 0; y < height; y++ ){

        t1 = t2 = t3 = t4 = 0;
        for( kx = 0; kx <= r4; kx = kx + 4 ){

            //total += src[ kx + y * w4 ]; 
            buffer = src[ kx + y * w4 ];
            t1 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ kx + y * w4 + 1 ];
            t2 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ kx + y * w4 + 2 ];
            t3 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ kx + y * w4 + 3 ];
            t4 += isNaN( buffer ) ? 0 : buffer;
        }
        
        dst[ y * w4 ] = Math.floor( t1 / (radius + 1) );
        dst[ y * w4 + 1 ] = Math.floor( t2 / (radius + 1) );
        dst[ y * w4 + 2 ] = Math.floor( t3 / (radius + 1) );
        //dst[ y * w4 + 3 ] = Math.floor( t4 / 2 );

        ty = y * w4 ;
        for( x = 0; x < w4; x = x + 4 ){

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

            dst[ x + y * w4 ] = Math.floor( t1 / divide );
            dst[ x + y * w4 + 1 ] = Math.floor( t2 / divide );
            dst[ x + y * w4 + 2 ] = Math.floor( t3 / divide );
            //dst[ x + y * w4 + 3 ] = Math.floor( t4 / divide );
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
