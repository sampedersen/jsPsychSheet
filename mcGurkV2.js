function ExampleExperiment(jsSheetHandle, jsPsychHandle, survey_code) {
    jsSheetHandle.CreateSession(RunExperiment)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      SET UP         /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function RunExperiment(session) {
        // Generate a random subject ID (6 characters)
        var subjectID = jsPsych.randomization.randomID(6);
        var subjectCondition = null; /* change this later depending on what condition participants are assigned to */

        // Record the condition assignment in the jsPsych data
        // Adds "subject" and "condition" properties to each trial
        jsPsych.data.addProperties({subject: subjectID, condition: subjectCondition});

        // Create the timeline
        var timeline = [];

        // Welcome message
        var welcome = {type: "html-keyboard-response",
            stimulus: "Welcome to the experiment- thank you for your participation. Press any key to begin."};
        timeline.push(welcome);

        // Participant consent
        // NOTE: We're doing a new experiment, need to source new consent form
        // NOTE: deleting this chunk and the check_fn in the trial variable breaks the continue button
        var check_consent = function(elem) {
            if (document.getElementById('consent_checkbox').checked) {
                return true;
            }
            else {
                alert("If you wish to participate, you must check the box next to the statement 'I agree to participate in this study.'");
                return false;
            }
            return false;
        };

        var trial = {
            type:'external-html',
            url: "resources/Consent.html",
            cont_btn: "consent-button",
            //check_fn: check_consent
        };
        timeline.push(trial);

        // Check participants' browsers for Chrome/Firefox
        let browser = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Please complete this experiment using <strong>Google Chrome or Firefox</strong>. ' +
                    'If you are not using Google Chrome or Firefox, please close the experiment and reopen it in a suggested ' +
                    'browser.'+
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 7500, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(browser);

        // Participant age
        var survey = {
            type: "survey-text",
            questions: [
                {prompt: "How old are you?",
                    required: true,
                    name: "Age"}
            ]
        };
        timeline.push(survey);

        // Participant sex
        var sex_options = ["Male", "Female", "Intersex"];
        var sex = {
            type: "survey-multi-choice",
            questions: [
                {prompt:"Please identify your sex.",
                    name: "Sex",
                    options: sex_options,
                    required:true}
            ]
        };
        timeline.push(sex);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////       INSTRUCTIONS     //////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* ----------------------------------   Generic instructions    ---------------------------------------------------*/
        
        // ***ADD A DISCLAIMER ABOUT THE USE OF EYETRACKING*** 

        /* instructions pg 1  */
        let introInstructions = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Thank you for your participation in this experiment. ' +
                ' Please read the instructions entirely before beginning.</p>' +
                jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 3000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(introInstructions);

        /* instructions pg 2 - sound check instructions */
        let soundCheckInstructions = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>For the duration of the experiment, please use headphones or turn your speakers to a comfortable volume.' +
                    'Please use the following screen as an opportunity to check your audio settings and adjust as necessary.</p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 3000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(soundCheckInstructions);

        /* sound check screen */
        var pre_if_trial = {
            type: 'video-keyboard-response',
            sources: ['resources/AuditoryBaVisualBa.mp4'],
            width: 800,
            prompt:
                '<p>Press any key to repeat the video and adjust your volume as necessary. When you are ready to continue, press C.</p>'
        };
        var loop_node = {
            timeline: [pre_if_trial],
            loop_function: function(data){
                if(jsPsych.pluginAPI.convertKeyCharacterToKeyCode('c') == data.values()[0].key_press){
                    return false;
                }
                else {
                    return true;
                }
            }
        };
        timeline.push(pre_if_trial, loop_node);


        /* instructions pg 3 */
        var instructions_p3wait = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>Throughout the duration of the experiment, please sit at an arm's distance from your computer " +
                "screen, as illustrated above. Additionally, please focus your attention to the center of your screen.</p>",
            choices: jsPsych.NO_KEYS,
            trial_duration: 7500,
        };
        var instructions_p3go = {
            type: "image-keyboard-response",
            stimulus: "resources/arm.png",
            prompt: "<p>Throughout the duration of the experiment, please sit at an arm's distance from your computer " +
                "screen, as illustrated above. Your attention should also be focused on the center of your screen.</p>" +
                "<p> Once you have done so, press any key to continue.</p>",
        };
        timeline.push(instructions_p3wait, instructions_p3go);


/*  --------------------------------- EXPERIMENT INFORMATION -------------------------------------------------------*/
        // Insert experiment instructions here //

        let  instructionsPg3 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>For this experiment, you will be watching videos of a woman prounouncing a syllable. ' +
                    'Each video will play only <strong>once</strong> per trial.</p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 4000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(instructionsPg3);

        let instructionsPg4 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>After watching the video, select the syllable that best matches the sound made by the woman. </p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 2000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(instructionsPg4);

        let instructionsPg5 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>After providing a response, please indicate how confident you feel in your selection on a scale of 0 to 100. ' +
                    '0 indicates <strong>no confidence</strong> and 100 indicates <strong>full confidence</strong>.</p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 4000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(instructionsPg5);

        let instructionsPg6 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return ' <p> After providing a confidence response, the next video will automatically play and this sequence will repeat. ' +
                    ' The experiment will be conducted in three blocks. Each block will be separated by a short break period. ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 5000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(instructionsPg6);
        
        
        // Need to update the compensation info for the new platform
        let compensationInfo = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return ' Note: new platform => compensation method ' +
                    ' abc ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 1000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(compensationInfo);


/* ----------------------------------------    PRACTICE    ------------------------------------------------------ */

        let instructionsPg7 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p> Before the experiment begins, we will conduct some practice trials.' +
                    'These trials are only for practice and your responses will not be recorded.</p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 3000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(instructionsPg7);

        var practiceTrial = {
            timeline: [
                // Show video
                { type: 'video-button-response',
                    sources: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'),
                    trial_ends_after_video: true,
                    prompt: '<p></p>'
                },

                // Participant percept
                { type: 'video-button-response',
                    sources: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'),
                    prompt: '<p>Which syllable did you perceive?</p>'
                },

                // Participant confidence
                { type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];},
                    step: 1,
                    prompt: "<p>Rate confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
            ],
            timeline_variables: [
                { video: ['resources/AuditoryBaVisualBa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ga','Da','Ma'],1) },
                { video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Da','Ga','Pa'],1) },
                { video: ['resources/AuditoryBaVisualKa.mp4'], syllables: jsPsych.randomization.repeat(['Ba','Ka','Ga','Da'],1) }
            ]
            randomize_order: false,
            repetitions: 0
        };
        timeline.push(practiceTrial);
        
/* ----------------------------------------   END PRACTICE    ------------------------------------------------------ */
        
        let instructionsPg8 = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p>Now that you have completed the practice trials, we are ready to begin the first part of the experiment. ' +
                    'Please be sure that you are seated arm\'s distance from your screen. ' +
                    '<strong>Your responses will now be recorded.</strong></p>' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: *5000*, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(instructionsPg8);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      EXPERIMENT    /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        // Stimuli bank
        /*

        congruentStimuli: [
        { video: ['resources/AuditoryNaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Ma', 'La', 'Ka' ],1) },
        { video: ['resources/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ga', 'Ba'],1) },
        { video: ['resources/AuditoryGaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Da', 'Ka', 'Ta'],1) },
        { video: ['resources/AuditoryTaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ka', 'Ga', 'Da'],1) },
        ]

        mcGurkStimuli: [
        { video: ['resources/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma', 'Ta', 'Na', 'La'],1) },
        { video: ['resources/AuditoryBaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Ta', 'Pa', 'Da'],1) },
        { video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Da', 'Ga', 'Pa'],1) },
        { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Da', 'Ka', 'Ta'],1) },
        ]

        incongruentStimuli: [
         { video: ['resources/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Da', 'Ka', 'Ma'],1) },
         { video: ['resources/AuditoryPaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ka', 'Da'],1) },
         { video: ['resources/AuditoryGaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Ta', 'Ka', 'Na'],1) },
         { video: ['resources/AuditoryTaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ma', 'Pa', 'Da'],1) }
        ]

        */


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      Congruent Exposure         ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var congruentTimeline = {
            timeline: [
                {   // Show video
                    type: 'video-button-response',
                    sources: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'), /* Store the video name */
                    trial_ends_after_video: true,
                    prompt: '<p></p>'
                },
                {   // Collect participant's percept
                    type: 'video-button-response',
                    sources: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
                    prompt: '<p>Which syllable did you perceive?</p>'
                {
                    // Participant confidence
                    type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
                    },
                    step: 1,
                    prompt: "<p>Rate your confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
                ],
            timeline_variables: [
                { video: ['resources/AuditoryNaVisualNa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Ma', 'La', 'Ka' ],1) },
                { video: ['resources/AuditoryPaVisualPa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ga', 'Ba'],1) },
                { video: ['resources/AuditoryGaVisualGa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Da', 'Ka', 'Ta'],1) },
                { video: ['resources/AuditoryTaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ka', 'Ga', 'Da'],1) },
                ],
            randomize_order: true,
            repetitions: 15 //This may change
        };

        let endCongruentExposure = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p> This concludes the first portion of the experiment. Please use this screen to take a break. ' +
                    ' There is no time-limit. ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 2000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>When you are ready to continue, press any key.</p>'}
            ]
        };
        timeline.push(endCongruentExposure);

        var startMcGurkExposure = {
            type: "html-keyboard-response",
            stimulus:
                "<p> Press any key to begin the next part of the experiment. </p>"
        };

        timeline.push(congruentTimeline, endCongruentExposure, startMcGurkExposure);



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      McGurk Exposure         ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var mcGurkTimeline = {
            timeline: [
                {   // Show video
                    type: 'video-button-response',
                    sources: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'), /* Store the video name */
                    trial_ends_after_video: true,
                    prompt: '<p></p>'
                },
                {   // Collect participant's percept
                    type: 'video-button-response',
                    sources: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
                    prompt: '<p>Which syllable did you perceive?</p>'
                {
                    // Participant confidence
                    type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
                    },
                    step: 1,
                    prompt: "<p>Rate your confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
            ],
            timeline_variables: [
                { video: ['resources/AuditoryMaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ma', 'Ta', 'Na', 'La'],1) },
                { video: ['resources/AuditoryBaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Ta', 'Pa', 'Da'],1) },
                { video: ['resources/AuditoryBaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Ba', 'Da', 'Ga', 'Pa'],1) },
                { video: ['resources/AuditoryPaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Da', 'Ka', 'Ta'],1) },
            ]
            randomize_order: true,
            repetitions: 15 //This may change
        };

        let endMcGurkExposure = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return '<p> This concludes the second portion of the experiment. Please use this screen to take a break. ' +
                    ' There is no time-limit. ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 2000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>When you are ready to continue, press any key.</p>'}
            ]
        };
        timeline.push(endMcGurkExposure);

        var startNonBindingExposure = {
            type: "html-keyboard-response",
            stimulus:
                "<p> Press any key to begin the last part of the experiment. </p>"
        };

        timeline.push(mcGurkTimeline, endMcGurkExposure, startNonBindingExposure);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      NonBinding Exposure         ////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        var nonBindingTimeline = {
            timeline: [
                {   // Show video
                    type: 'video-button-response',
                    sources: jsPsych.timelineVariable('video'),
                    width: 800,
                    choices: [],
                    data: jsPsych.timelineVariable('video'), /* Store the video name */
                    trial_ends_after_video: true,
                    prompt: '<p></p>'
                },
                {   // Collect participant's percept
                    type: 'video-button-response',
                    sources: [],
                    width: 800,
                    choices: jsPsych.timelineVariable('syllables'),
                    data: jsPsych.timelineVariable('syllables'), /* Store the answer choices on that trial */
                    prompt: '<p>Which syllable did you perceive?</p>'
                {
                    // Participant confidence
                    type: 'html-slider-response',
                    stimulus: '<p>How confident are you in your answer?</p>',
                    labels: ['0','25','50','75','100'],
                    min: 0,
                    max: 100,
                    start: function(){
                        return jsPsych.randomization.sampleWithoutReplacement([10, 20, 30, 40, 50, 60, 70, 80, 90], 1)[0];
                    },
                    step: 1,
                    prompt: "<p>Rate your confidence from 0 (no confidence) to 100 (fully confident)</p>",
                    require_movement:true
                }
            ],
            timeline_variables: [
                 { video: ['resources/AuditoryNaVisualDa.mp4'], syllables: jsPsych.randomization.repeat(['Na', 'Da', 'Ka', 'Ma'],1) },
                 { video: ['resources/AuditoryPaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Pa', 'Ta', 'Ka', 'Da'],1) },
                 { video: ['resources/AuditoryGaVisualTa.mp4'], syllables: jsPsych.randomization.repeat(['Ga', 'Ta', 'Ka', 'Na'],1) },
                 { video: ['resources/AuditoryTaVisualMa.mp4'], syllables: jsPsych.randomization.repeat(['Ta', 'Ma', 'Pa', 'Da'],1) }
                ],
            randomize_order: true,
            repetitions: 15 //This may change
        };
        timeline.push(nonBindingTimeline);

        
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////      CLOSING         /////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        /* closing page */
        let closingPage = {
            type: 'html-keyboard-response',
            stimulus: function() {
                return ' <p>This now concludes the experiment. <strong> ' +
                    'Please do not close the experiment until your responses have been confirmed as recorded.' +
                    '</strong> Press the right arrow key to be credited.</p> ' +
                    jsPsych.timelineVariable('extra_instruction', true)+'</p>'
            },
            choices: jsPsych.timelineVariable('choices'),
            trial_duration: jsPsych.timelineVariable('trial_duration'),
            timeline: [{}],
            timeline_variables: [
                {choices: jsPsych.NO_KEYS, trial_duration: 1000, extra_instruction: ''},
                {choices: jsPsych.ALL_KEYS, trial_duration: null, extra_instruction: '<p>Press any key to continue.</p>'}
            ]
        };
        timeline.push(closingPage);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        /* experiment initiation sequence */
        jsPsych.init({
            timeline: timeline,
            show_progress_bar: true,
            on_trial_finish: session.insert,
            on_finish: function() {
                window.top.location.href = `https://ufl.sona-systems.com/webstudy_credit.aspx?experiment_id=144&credit_token=97e1a7b13d9e4e098133f23a76e40e04&survey_code=${survey_code}`
            }
        });
    }
}
