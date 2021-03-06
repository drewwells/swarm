//(function(){

var canvas = document.getElementById('image'),
    ctx = canvas.getContext('2d'),
    canvas2 = document.getElementById('image-blur'),
    ctx2 = canvas2.getContext('2d'),
    virgin = true,
    img = new window.Image(),
    kittenSpeed = 50,
    snakeSpeed = 35;
    
img.src = 'amanda.jpg';

img.onload = function(){

    if( virgin ){
        ctx.canvas.width = ctx2.canvas.width = this.naturalWidth;
        ctx.canvas.height = ctx2.canvas.height = this.naturalHeight;
    }
    ctx.drawImage( img, 0, 0 );

    if( virgin ){
        ctx2.drawImage( img, 0, 0 );  
        setTimeout(function(){ switchImage( 0 ); },0);
        button.click();
    }

};

function switchImage( imageNumber ){

    imageNumber %= 4;
    img.src = imageNumber + '.jpeg';
    ctx.drawImage( img, 0, 0 );
    setTimeout(function( ){
        switchImage( imageNumber = imageNumber + 1 );
    }, kittenSpeed * 1000);
};

function getImageData( canvas ){
    return canvas.getImageData( 0, 0, 
                                canvas.canvas.width,
                                canvas.canvas.height );
}
var move = (function(){
    var iterations = 0,
        bitx = 1, bity = 1;
    return function( x, y, dx, dy ){
        var rx = Math.random() + .5,
            ry = Math.random() + .5;
        if( ++iterations % 17 === 0 ){ 
            if( Math.random() > .5 ){
                bitx = -bitx;
            }
            if( Math.random() > .5 ){
                bity = -bity;
            }
        }
        return [ Math.floor( dx * rx * bitx + x ), Math.floor( dy * ry * bity + y ) ];
    };
})();

function blurIt(){

    var maxw = img.naturalWidth,
        maxh = img.naturalHeight,
        y, x = y = 0,
        dx, dy = dx = 11; //Important to keep this value not divisible by height or width
    var arr = [];
    if( virgin ){

        virgin = false;
        ctx2.putImageData( Blur( getImageData( ctx ), getImageData( ctx ), 10),  0, 0);

        (function blurme( x, y, w, h ){
            arr = move( x, y, dx, dy );
            arr.splice( 2, 0, w, h );
            //Boundary detection
            // if( arr[0] + w > maxw ) {
            //     arr[0] = arr[0] + maxw - w;
            // } else if( arr[0] - w < 0 ){ 

            //     arr[0] = arr[0] - maxw + w; 
            // }
            if( arr[1] + ( h || w ) > maxh ){
                arr[1] = arr[1] - maxh + ( h || w );
            } else if( arr[1] - ( h || w ) < 0 ){ 
                
                arr[1] = arr[1] + maxh - ( h || w ); 
            }

            ctx2.putImageData( 
                Blur( getImageData( ctx ), getImageData( ctx2 ), 10, arr[0], arr[1], w, h ), 
                0, 0 );
            window.setTimeout(function(){
                blurme.apply( null, arr );
            }, snakeSpeed);
        })( 50, 50, 43 );
    }
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
    //No box provided, set entire image as box
    if( !boxWidth && !boxHeight ){
        boxWidth = boxWidth || imageWidth;  
        boxHeight = boxHeight || imageHeight;
    }

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
             y = y + 1 ){

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

var radios = document.getElementsByTagName('input'),
    radioLen = radios.length,
    radio;

function updateSnakeSpeed(){
    snakeSpeed = this.value;
}

function updateKittenSpeed(){
    kittenSpeed = this.value;
}

while( radioLen-- ){
    radio = radios[radioLen];
    if( radio.type === 'radio' ){
 
        if( radio.name === 'snake' ){

            radio.onchange = updateSnakeSpeed;
        } else if( radio.name === 'kitten' ){

            radio.onchange = updateKittenSpeed;
        }
    }
}

//Push button
//})();