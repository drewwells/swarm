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

function getImageData( canvas ){
    return canvas.getImageData( 0, 0, 
                                canvas.canvas.width,
                                canvas.canvas.height );
}
function blurIt(){

    var w = img.naturalWidth,
        h = img.naturalHeight,
        radius = 3,
        y,
        x = y = 0;
    var dx = 10, dy = 10;
    //ctx2.putImageData( Blur( getImageData( ctx ), getImageData( ctx2 ), 10, 100, 100, 25), 0, 0 );
    //return;
    (function blurme( x,y,r ){
        if( x + r > w || x - r < 0 ){ dx = -dx; }
        if( y + r > h || y - r < 0 ){ dy = -dy; }

        ctx2.putImageData( Blur( getImageData( ctx ), getImageData( ctx2 ), 10, x, y, 50, 50 ), 0, 0 );
        setTimeout(function(){
            blurme( x + dx, y + dy, r );
        }, 150);
    })( 50, 50, 20 );
}

function Blur( source, dest, blurRadius, x, y, w, h ){
    blurRadius = blurRadius || 2;

    return BlurVert(  source, dest, blurRadius, x, y, w, h );
    //return BlurVert(  source, dest, blurRadius , 100, 150, 50 );
    //return BlurLine( BlurVert(  source, dest, blurRadius ), dest, blurRadius );
}

function BlurVert( source, dest, blurRadius, startx, starty, boxWidth, boxHeight ){
    var ky, total,x,y,
        src = source.data, dst = dest.data,
        width = source.width,
        imageWidth = width * 4,
        imageHeight = source.height,
        height = boxHeight ? ( starty + boxHeight ) : imageHeight,
        w4 = boxWidth ? ( (startx + boxWidth) * 4 ) : imageWidth,
        r4 = blurRadius * 4,
        rw = blurRadius * imageWidth,
        ty,
        divide = blurRadius  + 1,
        boxRadius = false,
        boxRadius2 = false,
        t1,t2,t3,t4,
        buffer,
        yIterations;
    var q = 0;
    if( height > source.height ){ 

        height = imageHeight; 
    }
    if( w4 > imageWidth ){ 

        w4 = imageWidth; 
    }
    if( !boxHeight && boxWidth ){ 

        boxRadius = boxWidth; 
        boxRadius2 = Math.pow( boxRadius, 2 ); 
    }
    if( boxRadius ){

        x = ( startx - boxRadius  ) * 4;
    } else {

        x = startx * 4 || 0;
    }

    for( ; x <= w4; x = x + 4 ){

        t1 = t2 = t3 = t4 = 0;
        q = 0;
        if(  boxRadius ){

            //P Theorem 
            y = Math.sqrt( boxRadius2 - Math.pow( (x - startx * 4 ) / 4, 2 ) );
            //Normalize sqrt values a little bit
            // +1 helps reduce missing values
            y = starty - Math.floor( y ) + 1;
        } else {

            y = starty || 0;
        }

        for( ky = -blurRadius + starty; ky <= blurRadius + y; ky++ ){

            buffer = src[ x + ky * imageWidth ];
            t1 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ x + ky * imageWidth + 1 ];
            t2 += isNaN( buffer ) ? 0 : buffer;
            buffer = src[ x + ky * imageWidth + 2 ];
            t3 += isNaN( buffer ) ? 0 : buffer;
            q++;
        }

        dst[ y * imageWidth + x ] = Math.floor( t1 / q );
        dst[ y * imageWidth + x + 1 ] = Math.floor( t2 / q );
        dst[ y * imageWidth + x + 2 ] = Math.floor( t3 / q );
        //console.log( t1 );
        //console.log( src[ y * imageWidth + x ], dst[ y * imageWidth + x ] );
        for( ; !boxRadius ? 
             y < height : 
             Math.pow( y - starty, 2 ) + Math.pow( x/4 - startx, 2 ) < boxRadius2; 
             y++ ){

                 //Divide must be determined by the number of points

                 ty = y * imageWidth;

                 buffer = src[ x - rw + ty ];
                 t1 -= isNaN( buffer ) ? 0 : buffer;
//console.log( t1 );
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

                 if( boxRadius ){

                     dst[ x + ty ] = Math.floor( t1 / q );
                     //console.log( t1 );//src[ x + ty ], dst [ x + ty ] );
                     dst[ x + ty + 1 ] = Math.floor( t2 / q );
                     dst[ x + ty + 2 ] = Math.floor( t3 / q );
                 } else {

                     dst[ x + ty ] = Math.floor( t1 / divide );
                     dst[ x + ty + 1 ] = Math.floor( t2 / divide );
                     dst[ x + ty + 2 ] = Math.floor( t3 / divide );
                     //dst[ x + y * imageWidth + 3 ] = Math.floor( t4 / divide );
                 }
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
