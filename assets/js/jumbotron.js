var startAnimation = function(){
    // Background animation for the jumbotron.
    // Taken from https://codepen.io/jkiss/pen/OVEeqK
    
    var canvas = document.getElementById('jumbotron-anim'),
       can_w = parseInt(canvas.getAttribute('width')),
       can_h = parseInt(canvas.getAttribute('height')),
       ctx = canvas.getContext('2d');
    
    var ball = {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          r: 0,
          alpha: 0.01,
          phase: 0,
        //   hex_color: ['#ffc559a2', '#E9D2F4', '#49306B']
          hex_color: ['#484747de']
       },
       R = 4,
       balls = [], 
       dis_limit = 260,

    // Line
       link_line_width = 0.8,
       add_mouse_point = true,
       mouse_in = false,
       mouse_ball = {
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          r: R,
          type: 'mouse'
       };

       // variable distance limit edge connections
       window_width = $(window).width();
       if (window_width <= 500) {
           // small screens phones
           dis_limit = 200;
       } else if (window_width <= 768) {
            // small screens tablets
            dis_limit = 200;
       } else if (window_width < 1024 && window_width > 768) {
            // laptops
            dis_limit = 230;
       } else if (window_width >= 1024) {
            // large screens desktops
            dis_limit = 260;
       }
    

    // Random speed
    function getRandomSpeed(pos){
        var  min = -.03,
           max = .03;

        // // variable speed
        // window_width = $(window).width();
        // if (window_width < 1024 && window_width > 768) {
        //     // laptops
        //     min = -.04,
        //     max = .04;
        // } 
        // else if (window_width >= 1024) {
        //     // large screens desktops
        //     min = -.04,
        //     max = .04;
        // }
        
        switch(pos){
            case 'top':
                return [randomNumFrom(min, max), randomNumFrom(0.1, max)];
                break;
            case 'right':
                return [randomNumFrom(min, -0.1), randomNumFrom(min, max)];
                break;
            case 'bottom':
                return [randomNumFrom(min, max), randomNumFrom(min, -0.1)];
                break;
            case 'left':
                return [randomNumFrom(0.1, max), randomNumFrom(min, max)];
                break;
            default:
                return;
                break;
        }
    }
    function randomArrayItem(arr){
        return arr[Math.floor(Math.random() * arr.length)];
    }
    function randomNumFrom(min, max){
        return Math.random()*(max - min) + min;
    }
    // Random Ball
    function getRandomBall(){
        var pos = randomArrayItem(['top', 'right', 'bottom', 'left']);
        switch(pos){
            case 'top':
                return {
                    x: randomSidePos(can_w),
                    y: -R,
                    vx: getRandomSpeed('top')[0],
                    vy: getRandomSpeed('top')[1],
                    r: R,
                    alpha: 0.05,
                    phase: randomNumFrom(0, 10)
                }
                break;
            case 'right':
                return {
                    x: can_w + R,
                    y: randomSidePos(can_h),
                    vx: getRandomSpeed('right')[0],
                    vy: getRandomSpeed('right')[1],
                    r: R,
                    alpha: 0.05,
                    phase: randomNumFrom(0, 10)
                }
                break;
            case 'bottom':
                return {
                    x: randomSidePos(can_w),
                    y: can_h + R,
                    vx: getRandomSpeed('bottom')[0],
                    vy: getRandomSpeed('bottom')[1],
                    r: R,
                    alpha: 0.05,
                    phase: randomNumFrom(0, 10)
                }
                break;
            case 'left':
                return {
                    x: -R,
                    y: randomSidePos(can_h),
                    vx: getRandomSpeed('left')[0],
                    vy: getRandomSpeed('left')[1],
                    r: R,
                    alpha: 0.05,
                    phase: randomNumFrom(0, 10)
                }
                break;
        }
    }
    function randomSidePos(length){
        return Math.ceil(Math.random() * length);
    }
    
    // Draw Ball
    function renderBalls(){
        Array.prototype.forEach.call(balls, function(b, i){
        //    idx = i % 3;
           idx = 0;
           ctx.fillStyle = ball.hex_color[idx];
           ctx.beginPath();
           ctx.arc(b.x, b.y, R, 0, Math.PI*2, true);
           ctx.closePath();
           ctx.fill();
        });
    }
    
    // Update balls
    function updateBalls(){
        var new_balls = [];
        Array.prototype.forEach.call(balls, function(b){
            b.x += b.vx;
            b.y += b.vy;
    
            if(b.x > -(5) && b.x < (can_w+5) && b.y > -(5) && b.y < (can_h+5)){
               new_balls.push(b);
            }
        });
    
        balls = new_balls.slice(0);
    }
    
    // Draw lines
    function renderLines(){
        var fraction, alpha;
        for (var i = 0; i < balls.length; i++) {
            for (var j = i + 1; j < balls.length; j++) {
    
               fraction = getDisOf(balls[i], balls[j]) / dis_limit;
    
               if(fraction < 1){
                   alpha = (1 - 0.98 * fraction).toString();
                   ctx.strokeStyle = 'rgba(120,120,120,'+alpha+')';
                    // ctx.strokeStyle = 'rgba(144,144,144,'+alpha+')';
                   ctx.lineWidth = link_line_width;
    
                   ctx.beginPath();
                   ctx.moveTo(balls[i].x, balls[i].y);
                   ctx.lineTo(balls[j].x, balls[j].y);
                   ctx.stroke();
                   ctx.closePath();
               }
            }
        }
    }
    
    // calculate distance between two points
    function getDisOf(b1, b2){
        var  delta_x = Math.abs(b1.x - b2.x),
           delta_y = Math.abs(b1.y - b2.y);
        return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
    }
    
    // add balls if there a little balls
    function addBallIfy(){
        window_width = $(window).width();

        if (window_width <= 500 && balls.length < 17) {
            // small screens phones
            balls.push(getRandomBall());
        } else if (window_width <= 768 && balls.length < 20) {
            // small screens tablets
            balls.push(getRandomBall());
        } else if (window_width > 1024 && balls.length < 30) {
            // large screens desktops
            balls.push(getRandomBall());
        } else if (balls.length < 20) {
            // default
            balls.push(getRandomBall());
        }

    }
    
    // Render
    function render(){
        if (Date.now() - lastCanvasSizeUpdate > 1000) {
            updateCanvasSize();
        }
      if (balls.length == 0) {
        // variable number of balls
        window_width = $(window).width();
        num_balls = 20;
        if (window_width <= 768) {
           // small screens phones
           num_balls = 15;
        } else if (window_width >= 1024) {
            // large screens desktops
            num_balls = 30;
        }

        initBalls(num_balls);
      }
    
      ctx.clearRect(0, 0, can_w, can_h);
        
      renderLines();

      renderBalls();
    
      updateBalls();
    
      addBallIfy();
    
      window.requestAnimationFrame(render);
    }
    
    // Init Balls
    function initBalls(num){
        for(var i = 0; i < num; i++){
            balls.push({
                x: randomSidePos(can_w),
                y: randomSidePos(can_h),
                vx: getRandomSpeed('top')[0],
                vy: getRandomSpeed('top')[1],
                r: R,
                alpha: 0.1,
                phase: randomNumFrom(0, 10)
            });
        }
    }
    
    var lastCanvasSizeUpdate = 0;
    
    function updateCanvasSize() {
        can_w = canvas.width = canvas.offsetWidth;
        can_h = canvas.height = canvas.offsetHeight;
        lastCanvasSizeUpdate = Date.now();
    }
    
    // Init Canvas
    function initCanvas(){
    }
    
    window.addEventListener('resize', function(e){
        updateCanvasSize();
    });
    
    function startCanvasAnimation(){
        initCanvas();
        window.requestAnimationFrame(render);
    }
    
    // Mouse effect
    canvas.addEventListener('mouseenter', function(){
        mouse_in = true;
        balls.push(mouse_ball);
    });
    canvas.addEventListener('mouseleave', function(){
        mouse_in = false;
        var new_balls = [];
        Array.prototype.forEach.call(balls, function(b){
            if(!b.hasOwnProperty('type')){
                new_balls.push(b);
            }
        });
        balls = new_balls.slice(0);
    });
    canvas.addEventListener('mousemove', function(e){
        var e = e || window.event;
        var rect = canvas.getBoundingClientRect();
    
        mouse_ball.x = e.clientX - rect.left;
        mouse_ball.y = e.clientY - rect.top;
    });
    
    function startAnimation() {
        window.addEventListener('DOMContentLoaded', startCanvasAnimation);
    }
    
    return startAnimation;
    
    }();
    
    