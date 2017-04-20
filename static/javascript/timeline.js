//ui controller
var replayController = function (soundTransactionSystem, transactionSystem, slider) {
        self = this;
        var totalTime = null;
        var startTime = null;
        var playedTime = null;
        var systemTimeUpdateCounter = null;
        var notReviewMode = null;
        //teacher may not in the room
        var updateInternvarSecond = 1000;
        var classEnd = null;

        function totalTimeInitAndServerTimeUpdater() {
            return $.ajax({
                url: '/current_time',
                type: "POST",
                data: JSON.stringify({
                    type: "time"
                }),
                contentType: "application/json",
            }).then(function (response) {
                if (!classEnd) totalTime = new Date(response.time);
                if (notReviewMode) playedTime = totalTime;
                if (!startTime) console.error("you should get a start time befoer total time init");
            });
        }

        function sliderUpdater() {
            if (!startTime && !transactionSystem.firstTransactionTime()) {
                //there isn't any transaction system first transaction
                setTimeout(sliderUpdater, updateInternvarSecond);
                slider.val(100.0);
                return;
            }
            else if (!startTime && transactionSystem.firstTransactionTime()) {
                //give first time from first transaction
                notReviewMode = true;
                startTime = transactionSystem.firstTransactionTime();
                totalTimeInitAndServerTimeUpdater().then(function () {
                    slider.prop('disabled', false);
                    attachListener(slider);
                    sliderUpdater();
                });
                slider.val(100.0);
            }
            else if (classEnd) {
                if (notReviewMode) {
                    setTimeout(sliderUpdater, updateInternvarSecond);
                    return;
                } else {
                    //class end in the review mode
                    //run  every 0.1 second
                    playedTime = new Date(playedTime.getTime() + updateInternvarSecond);
                    if (playedTime >= totalTime) {
                        //playedTime should greater than total time
                        playedTime = totalTime;
                        slider.val(100);
                        notReviewMode = true;
                        setTimeout(sliderUpdater, updateInternvarSecond);
                        return;
                    }
                    slider.val((playedTime.getTime() - startTime.getTime()) / (totalTime.getTime() - startTime.getTime()) * 100);
                    //TODO: delete this later
                    console.log("class end");
                    console.log("current percentage:", slider.val());
                    console.log("total:", totalTime);
                    console.log("played:", playedTime);
                    //TODO:check if class over
                    setTimeout(sliderUpdater, updateInternvarSecond);
                }
            } else if (notReviewMode) {
                //normal live mode
                if (systemTimeUpdateCounter >= 30) {
                    if (!classEnd) totalTimeInitAndServerTimeUpdater();
                    systemTimeUpdateCounter = 0;
                }
                //run  every 0.1 second
                totalTime = new Date(totalTime.getTime() + updateInternvarSecond);
                playedTime = totalTime;
                //TODO: delete this later
                console.log("current percentage:", slider.val());
                console.log("total:", totalTime);
                console.log("played:", playedTime);
                systemTimeUpdateCounter++;
                //TODO:check if class over
                setTimeout(sliderUpdater, updateInternvarSecond);
            } else if (!notReviewMode) {
                //review mode
                if (systemTimeUpdateCounter >= 30) {
                    if (!classEnd) totalTimeInitAndServerTimeUpdater();
                    systemTimeUpdateCounter = 0;
                }
                //run  every 0.1 second
                playedTime = new Date(playedTime.getTime() + updateInternvarSecond);
                totalTime = new Date(totalTime.getTime() + updateInternvarSecond);
                slider.val((playedTime.getTime() - startTime.getTime()) / (totalTime.getTime() - startTime.getTime()) * 100);
                //TODO: delete this later
                console.log("current percentage:", slider.val());
                console.log("total:", totalTime);
                console.log("played:", playedTime);
                systemTimeUpdateCounter++;
                //TODO:check if class over
                setTimeout(sliderUpdater, updateInternvarSecond);
            }
        }

        self.presetEvent = function () {
            document.addEventListener(events.endRecitation.type, function () {
                classEnd = true;
            })
        }
        function enrollEvent() {
            document.addEventListener(events.endRecitation.type, classEndFunc);
        }

        function classEndFunc(e) {
            //TODO: need maek sure last transaction be set up before this function called
            e.target.removeEventListener(e.type, arguments.callee);
            classEnd = true;
            //no one should change total time after this
            totalTime = transactionSystem.lastTransactionTime();
            if (transactionSystem.privilege.indexOf("admin") != -1) {
                //instructor live
                adiminReInit();
            }
        }

        function adiminReInit() {
            // admin end from live mode
            slider.show();
            slider.val(100);
            //get start time again
            if (transactionSystem.firstTransactionTime()) {
                startTime = transactionSystem.firstTransactionTime();
                totalTime = transactionSystem.lastTransactionTime();
                playedTime = totalTime;
                notReviewMode = true;
                slider.off();
                attachListener(slider);
                setTimeout(sliderUpdater,updateInternvarSecond);
            } else {
                //no first transaction teacher haven't get in to room
                console.error("class end without any content");
                slider.prop('disabled', true);
            }
        }

        self.init = function () {

            if (!classEnd) {
                //class not end
                enrollEvent();
                if (transactionSystem.privilege.indexOf("admin") != -1) {
                    //instructor live
                    slider.hide();
                }
                //get start time
                else if (transactionSystem.firstTransactionTime()) {
                    setTimeout(sliderUpdater, updateInternvarSecond);
                } else {
                    //no first transaction teacher haven't get in to room
                    slider.prop('disabled', true);
                    setTimeout(sliderUpdater, updateInternvarSecond);
                }
            } else {
                //class already end(review mode)
                slider.show();
                slider.val(100);
                //get start time again
                if (transactionSystem.firstTransactionTime()) {
                    startTime = transactionSystem.firstTransactionTime();
                    totalTime = transactionSystem.lastTransactionTime();
                    playedTime = totalTime;
                    notReviewMode = true;
                    slider.off();
                    attachListener(slider);
                    setTimeout(sliderUpdater, updateInternvarSecond);
                } else {
                    //no first transaction teacher haven't get in to room
                    console.error("class end without any content");
                    slider.prop('disabled', true);
                    setTimeout(sliderUpdater, updateInternvarSecond);
                }

            }
        };
        function attachListener(slider) {
            slider.change('change', function () {
                //user change time
                //slider.val will get int
                if (slider.val() > 99) {
                    //jump to live
                    notReviewMode = true;
                    playedTime = totalTime;
                    document.dispatchEvent(events.switchToLive());
                    transactionSystem.switchTime();
                    soundTransactionSystem.jumpTo();
                } else {
                    notReviewMode = false;
                    playedTime = new Date(slider.val() * (totalTime.getTime() - startTime.getTime()) / 100 + startTime.getTime());
                    transactionSystem.switchTime(playedTime);
                    soundTransactionSystem.jumpTo(playedTime);
                    document.dispatchEvent(events.switchToPlayBack());
                }
            });
        }
    }
;