const language = $('html').attr('lang');

if (cookie('theme-color')) $('html').attr('data-theme', cookie('theme-color'));
var themeColor = $('html').attr('data-theme');

// change theme color
$('[change-theme-color]').click(function () {
    if (themeColor === 'dark') {
        themeColor = 'light';
        $('html').attr('data-theme', 'light');
    } else {
        themeColor = 'dark';
        $('html').attr('data-theme', 'dark');
    }

    cookie('theme-color', themeColor);
});



// cookie
function cookie(name, value, days = 30) {
    if (!value) return cookieGet(name);
    if (days === -1) return cookieErase(name);

    var expires = "";

    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = "; expires=" + date.toUTCString();

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function cookieGet(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
function cookieErase(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


// responsive navigation bar
function mobileMenu() {
    let burger = $('.navbar .burger');
    let menu = $('.navbar');
    let navlinks = $('.navbar li');

    $(burger).click(() => {
        $(menu).toggleClass('toggle');

        let bg = $(`.navbar .burger span`);
        if (bg.css('animation') != '0.2s ease-in 0s 1 normal forwards running burgerBG') bg.css('animation', 'burgerBG .2s ease-in forwards');
        else if (bg.css('animation') && bg.css('animation') !== "0.2s ease-in 0s 1 normal forwards running burgerBG") bg.css('animation', 'burgerBG .2s ease-in forwards');
        else bg.css('animation', 'burgerBGReverse .2s ease-in forwards');

        for (let index = 0; index < navlinks.length; index++) {
            let element = navlinks[index];

            if (element.style.animation) {
                element.style.animation = '';
            } else {
                element.style.animation = `navLinkFade .5s ease forwards ${index / 7 + 0.1}s`;
            }
        }
    });

}
mobileMenu();


// nav bar, set Bubble position. hover and click
function navLinks() {

    function setBubblePos(directions) {
        bubble.css('width', `${directions.width + 6}px`);
        bubble.css('top', `${directions.top + directions.height - 3}px`);
        bubble.css('left', `${directions.left - 3}px`);
    }

    function changeBubblePos(section) {
        let target = $(`.navbar-nav .nav-link[href="#${section}"]`)[0];

        $(active).removeClass('active');
        $(target).addClass('active');

        active = target;
        activeDirections = {
            height: active.offsetHeight,
            width: active.offsetWidth,
            top: active.offsetTop,
            left: active.offsetLeft
        };
        setBubblePos(activeDirections)
    }
    window.setBubblePos = setBubblePos;
    window.changeBubblePos = changeBubblePos;


    let navLinks = $('.navbar-nav .nav-link');
    let bubble = $('.navbar-nav .bubble');
    let active = $('.navbar-nav .nav-link.active')[0];
    let activeDirections = {
        height: active.offsetHeight,
        width: active.offsetWidth,
        top: active.offsetTop,
        left: active.offsetLeft
    };

    setBubblePos(activeDirections);

    // Move when hovered
    $(navLinks).hover(function () {
        // over
        setBubblePos({
            height: this.offsetHeight,
            width: this.offsetWidth,
            top: this.offsetTop,
            left: this.offsetLeft
        });
    }, function () {
        // out      // Return to active position
        setBubblePos(activeDirections);
    }
    )
        .click(function () {

            $(active).removeClass('active');
            $(this).addClass('active');

            active = this;
            activeDirections = {
                height: active.offsetHeight,
                width: active.offsetWidth,
                top: active.offsetTop,
                left: active.offsetLeft
            };
            setBubblePos(activeDirections)
        });

}
navLinks();


// hero title
function heroTitle() {
    let words = $('.hero-title h3').text().split(' ');
    $('.hero-title').html(words.map((word) => {
        return `<h3 class="mb-0"><span class="moved">${word}</span></h3>`
    }));
}
heroTitle();

(function () {
    // page preloader
    let loaderTL = gsap.timeline({});
    loaderTL
        .to('.loader', { opacity: 0, duration: .2 })
        .to(".loader-section", {
            x: '110%',
            skewX: '-15deg',
            duration: 1,
            stagger: {
                grid: 'auto',
                from: 'start',
                axis: "y",
                amount: .4
            }
        })
        .call(() => {
            $('#loader-wrapper').hide(150, () => $('#loader-wrapper').remove());
        })
        .to('.hero-title .moved', { y: 0, stagger: .05, duration: .3 }, '-=.3')
        .fromTo(['#home .content-part .text', '#home .content-part .btn', '.navbar'], { opacity: 0 }, { opacity: 1, duration: .4 }, '+=.1');


    // smooth scroll
    const locoScroll = new LocomotiveScroll({
        el: document.querySelector(".smooth-scroll"),
        smooth: true
    });

    // each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
    locoScroll.on("scroll", ScrollTrigger.update);

    // tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
    ScrollTrigger.scrollerProxy(".smooth-scroll", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        }, // we don't have to define a scrollLeft because we're only scrolling vertically.
        getBoundingClientRect() {
            return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
        },
        // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
        pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
    });



    const vh = (coef) => window.innerHeight * (coef / 100);

    // move the Bubble to the right position by scrolling
    function scrollBubble() {
        let sections = $('section');

        for (let i = 0; i < sections.length; i++) {
            let section = sections[i];

            ScrollTrigger.create({
                trigger: `#${section.id}`,
                start: `${vh(50)} bottom`,
                end: `${vh(50)} top`,
                onEnter: () => changeBubblePos(section.id),
                onEnterBack: () => changeBubblePos(section.id),
            });
        }
    }
    scrollBubble();



    // cursor
    {
        let $cursor = $('.page-cursor');

        function moveCursor(e) {
            gsap.to($cursor, 0.1, {
                css: {
                    left: e.pageX,
                    top: e.pageY
                }
            });
        }

        $(window).on('mousemove', moveCursor);

        function mouseEnter() {
            $cursor
                .css('transform', 'translate(-50%, -40%) scale(3)')
                .css('opacity', '.2');

        }
        function mouseLeave() {
            $cursor.css('transform', 'translate(-50%, -40%) scale(1)')
                .css('opacity', '.5');
        }

        cursorUpdate('a, .btn, .code-editor .icon');

        function cursorUpdate(el) {
            $(el).hover(mouseEnter, mouseLeave);
        }
        window.cursorUpdate = cursorUpdate;

    }


    // --------------- code editor -----------------
    {
        var typingInterval = null;

        let codeBlock = $('.code-block');

        let code =
            `function computerMove() {

    //  When the user is waiting for the computer to move
    cursor('context-menu');

    var alpha = -Infinity,
        beta = Infinity,
        value = -Infinity;

    let nicePlace;

    for (let element of cells) {

        // is available?
        if (!element.fill) {

            element.fill = true;
            emptyCells--;
            fillCell(element);

            value = alpha_beta(cells, false, computer, alpha, beta);

            fillCell(element, false);
            emptyCells++;
            element.fill = false;

            if (value >= beta) return value;

            if (value > alpha) {
                alpha = value;
                nicePlace = element;
            }

        }
  
    }
       
    setTimeout(() => {
            
        // Do the movement
        fillCell(nicePlace);
        nicePlace['fill'] = true;
        emptyCells--;
        GameCondition(currentPlayer, changeUi);
        cursor('pointer');
            
    }, computerMotionDelay);
     
} `;

        if ($(window).width() >= 768) setTimeout(writeCode, 2500);

        function writeCode() {
            codeBlock.empty();

            let cursor = '<span class="cursor">|</span>';
            let cursorDOM = '.code-block .cursor';
            codeBlock.append(cursor);

            code = code.split('');

            let index = 0;

            typingInterval = setInterval(() => {
                if (!(1 + index < code.length)) {
                    clearInterval(typingInterval);
                    gsap.to(cursorDOM, { opacity: 0, duration: .7, ease: "power2.inOut", repeat: -1 });
                    return
                }

                codeBlock.append(code[index]);

                $(cursorDOM).remove();
                Prism.highlightElement(codeBlock[0]);
                codeBlock.append(cursor);

                index++;

            }, 120);

        }

    }



    // --------------- works section ---------------
    {
        // making work cards
        fetch(`assets/works.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then(response => {
                if (!response.ok) return console.error(response.status + ' ' + response.statusText);
                return response.json()
            })
            .then(data => workSection(data))
            .catch(err => console.error(err));

        function workSection(data) {
            let startPoint = 0; // The cards will be cut from the start point.
            //                     Also, its value is equal to the number of the last card displayed

            const wrapper = $('#works-wrapper');
            const btn = `<div class="d-flex justify-content-center my-5 btn-load-wrapper"><a class="btn btn-load-more px-3">بارگذاری بیشتر...</a></div>`;
            const btnDom = '#works-wrapper .btn-load-wrapper';
            let content = '';

            function createCard() {

                endPoint = startPoint + 3;
                if (endPoint > data.length) endPoint = data.length;

                content = '';

                for (startPoint; startPoint < endPoint; startPoint++) {
                    let post = data[startPoint];
                    let badge = () => {
                        let result = '';
                        for (let i = 0; i < post.tools.length; i++) {
                            result += `<span class="badge mx-2 my-2">${post.tools[i]}</span>`
                        }
                        return result
                    }

                    let imgSmall = post.imgSmallSrc || post.imgSrc;

                    content +=
                        `
                        <div class="col-12 col-md-8 my-5 work-card-added">
                            <div class="card work border-0 bg-transparent">
                                <div class="img mb-4">
                                    <a href="${post.href}" target="_blank">
                                        <picture>
                                          <source media="(min-width:720px)" srcset="${post.imgSrc}">
                                          <img src="${imgSmall}" alt="${post.title}">
                                        </picture>
                                    </a>
                                </div>
                                <div class="card-body">
                                    <h6 class="mb-4 title"><a href="${post.href}" target="_blank">${post.title}</a></h6>
                                    <p class="text">${post.description}</p>
                                    <div class="tools"> <span class="title">ابزار ها: </span>
                                        ${badge()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                }

                $(btnDom).remove();

                $(wrapper).append(content);
                $('.work-card-added').fadeIn(250, ()=>locoScroll.update());

                if (startPoint < data.length) $(wrapper).append(btn);


                // load more card
                $(btnDom).click(createCard);

                cursorUpdate('a, .btn, .code-editor .icon');

            }
            createCard();

        }


    }


    // ---------------  contact section ------------

    {
        // Switching between inputs 
        function contactForm() {

            let level = 0; // level-0 = page 0... , level-2 = sending
            let emailIsValid = false;
            let alert = $('#contact-form .alert');
            let btnPrev = $('#contact-form .btn-prev');
            let btnNext = $('#contact-form .btn-next');
            let message = $('#contact-form .form-group-wrapper.message');
            let email = $('#contact-form .form-group-wrapper.email');

            $(alert).hide();
            $(email).hide();

            let messageInput = $('#message')[0];
            let emailInput = $('#email')[0];

            // when message is empty
            $(messageInput).on('input', () => {
                $('.progress-bar').css('width', '0%');

                if (messageInput.value === '') {
                    err('message field is required')
                } else {
                    err();
                    $('.progress-bar').css('width', '60%');
                }
            });

            function validateEmail() {
                $('.progress-bar').css('width', '60%');

                if (!emailInput.checkValidity()) {
                    err(emailInput.validationMessage)
                } else if (emailInput.value === '') {
                    err('email field is required')
                } else {
                    err();
                    emailIsValid = true;
                    $('.progress-bar').css('width', '100%');
                }
            }

            $(emailInput).on('input', validateEmail);

            $(btnNext).click(function () {
                if (messageInput.value === '') {
                    err('message field is required')
                    return
                }

                level++;

                $(email).slideDown();
                $(message).slideUp();

                $(btnPrev).removeClass('disabled');
                $('#contact-form .btn-next .text').text(nextBtnText(level));

                // send
                if (level === 2) {
                    validateEmail();

                    if (emailIsValid && messageInput.value !== '') sendForm();

                    level--;
                }
            });

            $(btnPrev).click(function () {
                level--;

                $(message).slideDown();
                $(email).slideUp();

                $(btnPrev).addClass('disabled');
                $('#contact-form .btn-next .text').text(nextBtnText(level));
            });

            // send form
            function sendForm() {
                $('.spinner-border').addClass('show');

                const form = $('#contact-form')[0];

                const formData = new FormData(form);

                fetch('contact.php', {
                    method: 'post',
                    body: formData
                })
                    .then((response) => {
                        $('.spinner-border').removeClass('show');

                        if (response.ok) return response.text();
                        return `${response.status} ${response.statusText}`
                    })
                    .then((text) => {
                        if (text) return err(text, 'danger');
                        err('Form submitted successfully', 'success')
                    })
                    .catch((err) => err(err, 'danger'));

            }

            // btn content
            function nextBtnText(level = level) {
                if (level === 0) {
                    return 'بعدی'
                }
                else if (level === 1) {
                    return 'ارسال'
                }
            }

            // show errors 
            function err(text, alertColor) {

                if (alertColor) {
                    $(alert).removeClass(function (index, classNames) {
                        var current_classes = classNames.split(" "),
                            classes_to_remove = [];

                        $.each(current_classes, function (index, class_name) {
                            if (/alert-.*/.test(class_name)) {
                                classes_to_remove.push(class_name);
                            }
                        });
                        return classes_to_remove.join(" ");
                    });

                    $(alert).addClass(`alert-${alertColor}`);
                }

                if (!text) $(alert).slideUp(400);
                else {
                    $(alert).text(text);
                    $(alert).slideDown(400);
                }
            }
        }
        contactForm();

        // stop scrolling with arrows, on .form-control
        $('.form-control')
            .focus(function () {
                $(this).parent().addClass('focus');
            })
            .blur(function () {
                if (!this.value) $(this).parent().removeClass('focus');
            });
        killLocoScrollOnInput('.form-control');


        // Dealing with Textarea Height
        function calcHeight(value) {
            // let numberOfLineBreaks = (value.match(/\n/g) || []).length;
            let numberOfLineBreaks = value.split(/\r\n|\r|\n/).length;
            let defaultLineBr = 4;
            if (numberOfLineBreaks < defaultLineBr) return 128;
            // min-height + lines x line-height + padding + border
            let newHeight = 48 + (numberOfLineBreaks * 24) + 12 + 0;
            return newHeight;
        }

        let textarea = $(".resize-ta");
        if (textarea != null) {
            $(textarea).keyup(function () {
                $(textarea).parent().height(calcHeight($(textarea).val()));
                locoScroll.update();
            });
        }


        // -----    place holder text animation     ----
        {
            let cursor = gsap.to('.placeholder .caret', { opacity: 0, duration: .6, ease: "power2.inOut", repeat: -1 });

            const inputs = {
                message: { el: $('#message')[0], words: ['برای من پیام بذار', 'یک سلام..', '', 'من همینجا منتظر میمونم. 👀'] },
                email: { el: $('#email')[0], words: ['example@dom.ain', 'mamyrbas@gmail.com'] }
            };

            for (let key in inputs) {
                // skip loop if the property is from prototype
                if (!inputs.hasOwnProperty(key)) continue;

                let input = inputs[key];

                let masterTl = gsap.timeline().pause();
                let textTl = gsap.timeline();

                $(input.el).focus(() => {
                    masterTl.play()
                });
                $(input.el).blur(() => {
                    masterTl.pause()
                });

                input['words'].forEach((word, i) => {
                    let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 1.4 });
                    tl.to(`#${key} + .placeholder .text`, { duration: 1.5, text: word });
                    masterTl.add(tl);
                });

            }


        }

        locoScroll.update()
    }


    // Disable scrolling when pressing the arrow keys
    function killLocoScrollOnInput(element) {
        $(element).keydown(function (e) {
            if (e.which == 38 || e.which == 40) {
                locoScroll.stop()
            }
        })
            .keyup(function () {
                locoScroll.start();
            });
    }




    // each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

    // after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
    ScrollTrigger.refresh();

    // contact form
    String.prototype.lines = function () { return this.split(/\r*\n/); }
    String.prototype.lineCount = function () { return this.lines().length; }


})();

