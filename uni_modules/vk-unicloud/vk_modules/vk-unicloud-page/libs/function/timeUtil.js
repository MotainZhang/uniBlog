/**
 * 时间工具类
 */
var util = {};
util.getTargetTimezone = function(val) {
	if (typeof val === "number") {
		return val;
	}
	let defaultValue = 8;
	let targetTimezone = defaultValue;
	try {
		const config = uni.vk.callFunctionUtil.getConfig();
		targetTimezone = config.targetTimezone;
		if (typeof targetTimezone !== "number") {
			targetTimezone = defaultValue;
		}
	} catch (err) {}
	return targetTimezone;
};

/**
 * 日期格式化
 * @param {Date || Number} date 需要格式化的时间
 * vk.pubfn.timeFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
 */
util.timeFormat = function(time, fmt = 'yyyy-MM-dd hh:mm:ss', targetTimezone) {
	try {
		targetTimezone = util.getTargetTimezone(targetTimezone);
		if (!time) {
			return "";
		}
		if (typeof time === "string" && !isNaN(time)) time = Number(time);
		// 其他更多是格式化有如下:
		// yyyy-MM-dd hh:mm:ss|yyyy年MM月dd日 hh时MM分等,可自定义组合
		let date;
		if (typeof time === "number") {
			if (time.toString().length == 10) time *= 1000;
			date = new Date(time);
		} else {
			date = time;
		}

		const dif = date.getTimezoneOffset();
		const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
		const east8time = date.getTime() + timeDif;

		date = new Date(east8time);
		let opt = {
			"M+": date.getMonth() + 1, //月份
			"d+": date.getDate(), //日
			"h+": date.getHours(), //小时
			"m+": date.getMinutes(), //分
			"s+": date.getSeconds(), //秒
			"q+": Math.floor((date.getMonth() + 3) / 3), //季度
			"S": date.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (let k in opt) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (opt[k]) : (("00" + opt[k]).substr(("" + opt[k]).length)));
			}
		}
		return fmt;
	} catch (err) {
		// 若格式错误,则原值显示
		return time;
	}
};

/**
 * 日期对象转换(云函数端会自动转成东八区时间)
 * @param {Date || Number} date 需要转换的时间
 * @param {Number} type 转换方式
 * type = 0 返回 2020-08-03 12:12:12
 * type = 1 返回 20200803121212
 * type = 2 返回 { YYYY, MM, DD, hh, mm, ss }
 * vk.pubfn.getFullTime(new Date());
 */
util.getFullTime = function(date, type = 0, targetTimezone) {
	if (!date) {
		return "";
	}
	targetTimezone = util.getTargetTimezone(targetTimezone);
	if (typeof date === "string" && !isNaN(date)) date = Number(date);
	if (typeof date == "number") {
		if (date.toString().length == 10) date *= 1000;
		date = new Date(date);
	}
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	const east8time = date.getTime() + timeDif;
	date = new Date(east8time);

	let YYYY = date.getFullYear() + '';
	let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
	let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
	let hh = (date.getHours() < 10 ? '0' + (date.getHours()) : date.getHours());
	let mm = (date.getMinutes() < 10 ? '0' + (date.getMinutes()) : date.getMinutes());
	let ss = (date.getSeconds() < 10 ? '0' + (date.getSeconds()) : date.getSeconds());
	if (type === 2) {
		return {
			YYYY: Number(YYYY),
			MM: Number(MM),
			DD: Number(DD),
			hh: Number(hh),
			mm: Number(mm),
			ss: Number(ss),

			year: Number(YYYY),
			month: Number(MM),
			day: Number(DD),
			hour: Number(hh),
			minute: Number(mm),
			second: Number(ss),
		};
	} else if (type === 1) {
		return YYYY + "" + MM + "" + DD + "" + hh + "" + mm + "" + ss;
	} else {
		return YYYY + "-" + MM + "-" + DD + " " + hh + ":" + mm + ":" + ss;
	}
};

/**
 * 获得相对当前周addWeekCount个周的起止日期
 * @param {Number} addWeekCount  默认0 (0代表本周 为-1代表上周 为1代表下周以此类推 为2代表下下周)
 * vk.pubfn.getWeekStartAndEnd(0);
 */
util.getWeekStartAndEnd = function(addWeekCount = 0, date = new Date(), targetTimezone) {
	targetTimezone = util.getTargetTimezone(targetTimezone);
	let res = {};
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	const east8time = date.getTime() + timeDif;
	const east8Date = new Date(east8time);
	// 返回date是一周中的某一天
	let week = east8Date.getDay();
	// 返回date是一个月中的某一天
	let month = east8Date.getDate();
	// 一天的毫秒数
	let oneDayMillisecond = 1000 * 60 * 60 * 24;
	// 相对于当前日期addWeekCount个周的日期
	date = new Date(date.getTime() + (oneDayMillisecond * 7 * addWeekCount));
	// 减去的天数
	let minusDay = week != 0 ? week - 1 : 6;
	let weekStart = new Date(date.getTime() - (oneDayMillisecond * minusDay));
	let weekEnd = new Date(weekStart.getTime() + (oneDayMillisecond * 6));
	let weekStartObj = util.getFullTime(weekStart, 2);
	let weekEndObj = util.getFullTime(weekEnd, 2);
	// 获得当前周的第一天
	res.weekStart = new Date(`${weekStartObj.year}/${weekStartObj.month}/${weekStartObj.day}`).getTime() - timeDif;
	// 获得当前周的最后一天
	res.weekEnd = new Date(`${weekEndObj.year}/${weekEndObj.month}/${weekEndObj.day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	return res;
}
/**
 * 获取时间范围
 * @param {Date} date 日期对象 可以指定时间计算节点，默认使用当前时间进行计算
 * 返回的是时间戳(防止时区问题)
 * 返回数据如下：
 {
   todayStart 今日开始时间
   todayEnd   今日结束时间
   today12End 今日上午结束时间
   monthStart 本月开始时间
   monthEnd   本月结束时间
   yearStart  本年开始时间
   yearEnd    本年结束时间
   weekStart  本周开始时间
   weekEnd    本周结束时间
   now        现在的时间点(含月年日时分秒)
   months     本年度每月的开始和结束时间 months[1] 代表1月
 }
 * vk.pubfn.getCommonTime();
 */
util.getCommonTime = function(date = new Date(), targetTimezone) {
	if (typeof date === "string" && !isNaN(date)) date = Number(date);
	if (typeof date == "number") {
		if (date.toString().length == 10) date *= 1000;
		date = new Date(date);
	}
	targetTimezone = util.getTargetTimezone(targetTimezone);
	let res = {};
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);

	const { year, month, day, hour, minute, second } = util.getFullTime(date, 2);
	// 现在的时间
	res.now = {
		year,
		month,
		day,
		hour,
		minute,
		second
	};
	// 获取本月最大天数
	let month_last_day = new Date(year, month, 0).getDate();
	// 获取今年12月最大天数
	let year_last_day = new Date(year, 12, 0).getDate();
	// 今日开始时间
	res.todayStart = new Date(`${year}/${month}/${day}`).getTime() - timeDif;
	// 今日12点时间
	res.today12End = new Date(`${year}/${month}/${day}`).getTime() + (12 * 60 * 60 * 1000 - 1) - timeDif;
	// 今日结束时间
	res.todayEnd = new Date(`${year}/${month}/${day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	// 本月开始时间
	res.monthStart = new Date(`${year}/${month}/1`).getTime() - timeDif;
	// 本月结束时间
	res.monthEnd = new Date(`${year}/${month}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	// 本年开始时间
	res.yearStart = new Date(`${year}/1/1`).getTime() - timeDif;
	// 本年结束时间
	res.yearEnd = new Date(`${year}/12/${year_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	// 计算上月开始-----------------------------------------------------------
	let year_last = year;
	let month_last = month - 1;
	if (month_last === 0) {
		month_last = 12;
		year_last = year - 1;
	}
	let month_last_day_last = new Date(year_last, month_last, 0).getDate();
	// 上月开始时间
	res.lastMonthStart = new Date(`${year_last}/${month_last}/1`).getTime() - timeDif;
	// 上月结束时间
	res.lastMonthEnd = new Date(`${year_last}/${month_last}/${month_last_day_last}`).getTime() + (24 * 60 * 60 *
		1000 - 1) - timeDif;
	// 计算上月结束-----------------------------------------------------------

	let weekObj = util.getWeekStartAndEnd(0, date);
	// 本周开始时间
	res.weekStart = weekObj.weekStart;
	// 本周结束时间
	res.weekEnd = weekObj.weekEnd;
	// 本年1-12月的起止时间
	res.months = [];
	res.months[0] = {
		monthStart: res.monthStart,
		monthEnd: res.monthEnd
	};
	for (let i = 1; i <= 12; i++) {
		// 获取此月最大天数
		let month_last_day = new Date(year, i, 0).getDate();
		// 此月开始时间
		let monthStart = new Date(`${year}/${i}/1`).getTime() - timeDif;
		// 此月结束时间
		let monthEnd = new Date(`${year}/${i}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
		res.months[i] = {
			monthStart,
			monthEnd
		};
	}
	return res;
};

/**
 * 获得指定年份和月份后的该月的开始时间和结束时间
 * 返回数据如下：(时间戳形式)
 {
   startTime 该月开始时间
   endTime   该月结束时间
 }
vk.pubfn.getMonthStartAndEnd({
	year:2021
	month:1
});
 */
util.getMonthStartAndEnd = function(obj, targetTimezone) {
	targetTimezone = util.getTargetTimezone(targetTimezone);
	let res = {
		startTime: null,
		endTime: null
	};
	let { year, month } = obj;
	if (year > 0 && month > 0) {
		const dif = new Date().getTimezoneOffset();
		const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
		let month_last_day = new Date(year, month, 0).getDate();
		// 开始时间
		res.startTime = new Date(`${year}/${month}/1`).getTime() - timeDif;
		// 结束时间
		res.endTime = new Date(`${year}/${month}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	}
	return res;
}


/**
 * 获得相对当前时间的偏移 count 天的起止日期(日的开始和结束)
 * @param {Number} count  默认0 (0代表今日 为-1代表昨日 为1代表明日以此类推)
 * @param {Date || Number} date 指定从那天开始计算
 * vk.pubfn.getDayOffsetTime(0);
 */
util.getDayOffsetStartAndEnd = function(count = 0, time, targetTimezone) {
	targetTimezone = util.getTargetTimezone(targetTimezone);
	let res = {};
	if (typeof time === "string" && !isNaN(time)) time = Number(time);
	let date;
	if (time) {
		if (typeof time === "number") {
			if (time.toString().length == 10) time *= 1000;
			date = new Date(time);
		} else {
			date = time;
		}
	} else {
		date = new Date();
	}
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	// 一天的毫秒数
	let oneDayMillisecond = 1000 * 60 * 60 * 24;
	// 相对于当前日期count个天的日期
	date = new Date(date.getTime() + (oneDayMillisecond * 1 * count));
	let dateObj = util.getFullTime(date, 2);
	// 获得当天的起始时间
	res.startTime = new Date(`${dateObj.year}/${dateObj.month}/${dateObj.day}`).getTime() - timeDif;
	// 获得当天的结束时间
	res.endTime = new Date(`${dateObj.year}/${dateObj.month}/${dateObj.day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	return res;
}
/**
 * 获得相对当前时间的偏移 count 个月的起止日期(月的开始和结束)
 * @param {Number} count  默认0 (0代表本月 为-1代表上月 为1代表下月以此类推)
 * @param {Date || Number} date 指定从那天开始计算
 * vk.pubfn.getMonthOffsetStartAndEnd(0);
 */
util.getMonthOffsetStartAndEnd = function(count = 0, time, targetTimezone) {
	targetTimezone = util.getTargetTimezone(targetTimezone);
	let res = {};
	if (typeof time === "string" && !isNaN(time)) time = Number(time);
	let date;
	if (time) {
		if (typeof time === "number") {
			if (time.toString().length == 10) time *= 1000;
			date = new Date(time);
		} else {
			date = time;
		}
	} else {
		date = new Date();
	}
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	let dateObj = util.getFullTime(date, 2);
	let month = dateObj.month + count;
	let year = dateObj.year;
	if (month > 12) {
		year = year + Math.floor(month / 12);
		month = Math.abs(month) % 12;
	} else if (month <= 0) {
		year = year - 1 - Math.floor(Math.abs(month) / 12);
		month = 12 - Math.abs(month) % 12;
	}
	let month_last_day = new Date(year, month, 0).getDate();
	// 开始时间
	res.startTime = new Date(`${year}/${month}/1`).getTime() - timeDif;
	// 结束时间
	res.endTime = new Date(`${year}/${month}/${month_last_day}`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	return res;
}

/**
 * 获得相对当前时间的偏移 count 年的起止日期(年的开始和结束)
 * @param {Number} count  默认0 (0代表今年 为-1代表去年 为1代表明年以此类推)
 * @param {Date || Number} date 指定从那天开始计算
 * vk.pubfn.getYearOffsetStartAndEnd(0);
 */
util.getYearOffsetStartAndEnd = function(count = 0, time, targetTimezone) {
	targetTimezone = util.getTargetTimezone(targetTimezone);
	let res = {};
	if (typeof time === "string" && !isNaN(time)) time = Number(time);
	let date;
	if (time) {
		if (typeof time === "number") {
			if (time.toString().length == 10) time *= 1000;
			date = new Date(time);
		} else {
			date = time;
		}
	} else {
		date = new Date();
	}
	const dif = date.getTimezoneOffset();
	const timeDif = dif * 60 * 1000 + (targetTimezone * 60 * 60 * 1000);
	let dateObj = util.getFullTime(date, 2);
	let year = dateObj.year + count;
	// 开始时间
	res.startTime = new Date(`${year}/1/1`).getTime() - timeDif;
	// 结束时间
	res.endTime = new Date(`${year}/12/31`).getTime() + (24 * 60 * 60 * 1000 - 1) - timeDif;
	return res;
};


/**
 * 判断是否是闰年
 * @param {Number | Date} year 需要计算的年份或时间,默认使用当前时间的年份
 * vk.pubfn.timeUtil.isLeapYear(year);
 */
util.isLeapYear = function(year) {
	if (typeof year === "undefined") {
		let { now } = util.getCommonTime();
		year = now.year;
	} else if (typeof year === "object") {
		let { now } = util.getCommonTime(year);
		year = now.year;
	}
	if (((year % 4) == 0) && ((year % 100) != 0) || ((year % 400) == 0)) {
		return true;
	} else {
		return false;
	}
}


/**
 * 判断是否是清明节
 * @param {Date} date 日期对象 可以指定时间计算节点，默认使用当前时间进行计算
vk.pubfn.timeUtil.isQingming(new Date());
 */
util.isQingming = function(data = new Date()) {
	let { now } = util.getCommonTime(data);
	let { year, month, day } = now;
	let key = false;
	// 清明节的日期是不固定的，规律是：闰年开始的前2年是4月4日，闰年开始的第3年和第4年是4月5日
	if (util.isLeapYear(year) || util.isLeapYear(year - 1)) {
		if (month === 4 && day === 4) {
			key = true;
		}
	} else {
		if (month === 4 && day === 5) {
			key = true;
		}
	}
	return key;
}


/**
 * 获得指定时间偏移 year年 month月 day天 hours时 minutes分 seconds秒前或后的时间戳
 * 返回时间戳
vk.pubfn.getOffsetTime(new Date(), {
	year:0,
	month:0,
	day:0,
	hours:0,
	minutes:0,
	seconds:0,
	mode:"after", // after 之后 before 之前
});
 */
util.getOffsetTime = function(date = new Date(), obj) {
	let time = (typeof date === "number") ? new Date(date) : date;
	let year = obj.year || obj.y;
	let month = obj.month || obj.m;
	let day = obj.day || obj.d;
	let hours = obj.hours || obj.hh;
	let minutes = obj.minutes || obj.mm;
	let seconds = obj.seconds || obj.ss;
	let { mode = "after" } = obj;
	if (mode == "before") {
		year *= -1;
		month *= -1;
		day *= -1;
		hours *= -1;
		minutes *= -1;
		seconds *= -1;
	}
	if (year) {
		time = time.setFullYear(time.getFullYear() + year);
		time = new Date(time);
	}
	if (month) {
		time = time.setMonth(time.getMonth() + month);
		time = new Date(time);
	}
	if (day) {
		time = time.setDate(time.getDate() + day);
		time = new Date(time);
	}
	if (hours) {
		time = time.setHours(time.getHours() + hours);
		time = new Date(time);
	}
	if (minutes) {
		time = time.setMinutes(time.getMinutes() + minutes);
		time = new Date(time);
	}
	if (seconds) {
		time = time.setSeconds(time.getSeconds() + seconds);
		time = new Date(time);
	}
	return time.getTime();
}

export default util;
