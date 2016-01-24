if (window.jQuery) {
    var myCourses;
    myCourses = $('#STDNT_WEEK_SCHD\\$scroll\\$0').find('#STDNT_WEEK_SCHD\\$scroll\\$0 >tbody >tr');
    if (myCourses) {
        totalCourses = myCourses.length - 1;

        var data = [];
        startMonth = 0;
        startDay = 7;
        endDate = 'April 15 2016';

        for (i = 0; i < totalCourses; i++) {
            tmp = $("#DERIVED_SSS_SCL_SSR_MTG_SCHED_LONG\\$" + i).text().split("\n")[0].split("-")[0].trim();
            byday = tmp.split(" ")[0].match(/.{1,2}/g);
            $.each(byday, function (index, item) {
                byday[index] = item.toUpperCase();
            });
            startTime = tmp.split(" ")[1].match(/(\d+)(?::(\d\d))?\s*(p?)/);
            endTime = $("#DERIVED_SSS_SCL_SSR_MTG_SCHED_LONG\\$" + i).text().split("\n")[0].split("-")[1].trim().match(/(\d+)(?::(\d\d))?\s*(p?)/);
            begin = new Date();
            begin.setMonth(startMonth);
            begin.setDate(startDay);
            begin.setHours(parseInt(startTime[1]) + (startTime[3] ? 12 : 0));
            begin.setMinutes(parseInt(startTime[2]) || 0);
            end = new Date();
            end.setMonth(startMonth);
            end.setDate(startDay);
            end.setHours(parseInt(endTime[1]) + (endTime[3] ? 12 : 0));
            end.setMinutes(parseInt(endTime[2]) || 0);
            subject = $("#CLASS_NAME\\$span\\$" + i).text().split("\n")[0];
            description = $("#CLASS_NAME\\$span\\$" + i).text().split("\n")[1];
            room = $("#DERIVED_SSS_SCL_SSR_MTG_SCHED_LONG\\$" + i).text().split("\n")[1];
            rrule = {
                freq: "WEEKLY",
                interval: 1,
                byday: byday,
                until: endDate
            }

            data.push({
                subject: subject,
                description: description,
                rrule: rrule,
                begin: begin,
                end: end,
                location: room
            })
        }

        var cal = ics();

        $.each(data, function (index, item) {
            cal.addEvent(item.subject, item.description, item.location, item.begin, item.end, item.rrule);
        });

        chrome.runtime.sendMessage({
            action: "getSource",
            source: cal.calendar()
        });
    }
}