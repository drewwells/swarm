var canvas = document.getElementById('image'),
 ctx = canvas.getContext('2d'),
 canvas2 = document.getElementById('image-blur'),
 ctx2 = canvas2.getContext('2d');

var img = new window.Image();
img.src = 'amanda.jpg';

img.onload = function(){

    ctx.canvas.width = ctx2.canvas.width = this.naturalWidth;
    ctx.canvas.height = ctx2.canvas.height = this.naturalHeight;
    ctx.drawImage( img, 0, 0 );
    ctx2.drawImage( img, 0, 0 );  
    button.click();
};

function getImageData( canvas ){
    return canvas.getImageData( 0, 0, 
                                canvas.canvas.width,
                                canvas.canvas.height );
}

function blurIt(){

    var maxw = img.naturalWidth,
        maxh = img.naturalHeight,
        y, x = y = 0,
        dx = 10, dy = 10;

    ctx2.putImageData( Blur( getImageData( ctx ), getImageData( ctx )), 0, 0);
    return;
    (function blurme( x, y, w, h ){
        if( x + w > maxw || x - w < 0 ){ dx = -dx; }
        if( y + ( h || w ) > maxh || y - ( h || w ) < 0 ){ dy = -dy; }

        ctx2.putImageData( Blur( getImageData( ctx ), getImageData( ctx2 ), 10, x, y, w, h ), 0, 0 );
        window.setTimeout(function(){
            blurme( x + dx, y + dy, w, h );
        }, 150);
    })( 50, 50, 20, 20 );
}

function Blur( source, dest, blurRadius, x, y, w, h ){
    blurRadius = blurRadius || 10;

    return BlurVert(  source, dest, blurRadius, x, y, w, h );
}

function BlurVert( source, dest, blurRadius, startx, starty, boxWidth, boxHeight ){
    var ky, total,x,y,
        src = source.data, dst = dest.data,
        width = source.width,
        imageWidth = width << 2,
        imageHeight = source.height,
        height = boxHeight ? ( starty + boxHeight ) : imageHeight,
        w4 = boxWidth ? ( (startx + boxWidth) * 4 ) : imageWidth,
        r4 = blurRadius << 2,
        rw = blurRadius * imageWidth,
        ty,
        divide = ( blurRadius << 1 ) + 1,
        boxRadius = false,
        boxRadius2 = false,
        t1,t2,t3,t4,
        buffer, temp, temp1;


    startx = startx || 0;
    starty = starty || 0;
    boxWidth = boxWidth || imageWidth;
    boxHeight = boxHeight || imageHeight;
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

        x = ( startx - boxRadius  ) << 2;
    } else {
        x = startx << 2 || 0;
    }

    for( ; x <= w4; x = x + 4 ){

        t1 = t2 = t3 = t4 = 0;
        if( boxRadius ){

            //P Theorem 
            y = Math.sqrt( boxRadius2 - Math.pow( (x - ( startx << 2 ) ) >> 2, 2 ) );
            //Normalize sqrt values a little bit
            // +1 helps reduce missing values
            y = starty - Math.floor( y ) + 1;
        } else {

            y = starty || 0;
        }

        for( ky = -blurRadius + y; ky <= blurRadius + y; ky++ ){

            t1 += src[ temp = x + ky * imageWidth ] || 0;
            t2 += src[ temp = temp + 1 ] || 0;
            t3 += src[ temp = temp + 1 ] || 0;
        }

        dst[ temp = y * imageWidth + x ] = Math.floor( t1 / divide );
        dst[ temp = temp + 1 ] = Math.floor( t2 / divide );
        dst[ temp = temp + 1 ] = Math.floor( t3 / divide );

        for( ; boxRadius ? 
             Math.floor( Math.pow( y - starty, 2 ) + Math.pow( x/4 - startx, 2 ) ) < boxRadius2 :
             y < height;
             y=y+1 ){

                 ty = y * imageWidth;
                 t1 -= src[ temp = x - rw + ty ] || 0;
                 t1 += src[ temp1 = x + rw + ty ] || 0;
                 t2 -= src[ temp = temp + 1 ] || 0;
                 t2 += src[ temp1 = temp1 + 1 ] || 0;
                 t3 -= src[ temp = temp + 1 ] || 0;
                 t3 += src[ temp1 = temp1 + 1 ] || 0;
                 if( boxRadius ){

                     dst[ temp = x + ty ] = Math.floor( t1 / divide );
                     dst[ temp = temp + 1 ] = Math.floor( t2 / divide );
                     dst[ temp = temp + 1 ] = Math.floor( t3 / divide );
                 } else {

                     dst[ temp = x + ty ] = Math.floor( t1 / divide );
                     dst[ temp = temp + 1 ] = Math.floor( t2 / divide );
                     dst[ temp = temp + 1 ] = Math.floor( t3 / divide );
                 }
             }
    }

    return dest;
}

function BlurLine( source, dest, radius ){
    var y, x, kx, total,
        w4 = width << 2,
        src = source.data, dst = dest.data,
        height = source.height,
        width = source.width,
        r4 = radius << 2,
        ty,
        divide = radius << 1 + 1,
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

var button = document.getElementById('blurit');
button.onclick = blurIt;
//Push button
