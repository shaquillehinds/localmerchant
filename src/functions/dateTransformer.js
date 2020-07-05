const toDayAndTime = ({ days, opening, closing }) => {
  const transformed = {};
  if (days && days.length > 0) {
    transformed.days = [];
    const weekDays = [1, 2, 3, 4, 5];
    const isWeekDays = weekDays.every((day) => days.includes(day));
    if (isWeekDays) transformed.days.push("Weekdays");
    else {
      days.sort();
      days.forEach((day) => {
        switch (day) {
          case 1:
            transformed.days[0] = "Mon";
            break;
          case 2:
            transformed.days[1] = "Tue";
            break;
          case 3:
            transformed.days[2] = "Wed";
            break;
          case 4:
            transformed.days[3] = "Thur";
            break;
          case 5:
            transformed.days[4] = "Fri";
            break;
          case 6:
            transformed.days[5] = "Sat";
            break;
          case 7:
            transformed.days[6] = "Sun";
            break;
          default:
            return null;
        }
      });
      if (days.length > 1) {
        transformed.days = transformed.days.filter((day) => day != "");
        let acc = days[0];
        const sequential = days.every((day, index) => day === acc + index);
        if (sequential) {
          transformed.days = [`${transformed.days[0]}-${transformed.days[transformed.days.length - 1]}`];
        }
      }
    }
  }
  if (opening) {
    if (parseInt(opening) > 1200) {
      const pm = (parseInt(opening.slice(0, 2)) - 12).toString() + ":" + opening.slice(2, 4);
      transformed.opening = pm.toString() + "pm";
    } else {
      let hour;
      opening.slice(0, 2)[0] === "0" ? (hour = opening.slice(1, 2)) : (hour = opening.slice(0, 2));
      transformed.opening = hour + ":" + opening.slice(2, 4) + "am";
    }
  }
  if (closing) {
    if (parseInt(closing) > 1200) {
      const pm = (parseInt(closing.slice(0, 2)) - 12).toString() + ":" + closing.slice(2, 4);
      transformed.closing = pm.toString() + "pm";
    } else {
      let hour;
      opening.slice(0, 2)[0] === "0" ? (hour = opening.slice(1, 2)) : (hour = opening.slice(0, 2));
      transformed.closing = hour + ":" + closing.slice(2, 4) + "am";
    }
  }
  return transformed;
};
const toStorageFormat = ({ days, opening, closing }) => {
  const transformed = {};
  if (days && days.length > 0) {
    transformed.days = [];
    days.forEach((day) => {
      switch (day) {
        case "Mon":
          transformed.days.push(1);
          break;
        case "Tue":
          transformed.days.push(2);
          break;
        case "Wed":
          transformed.days.push(3);
          break;
        case "Thur":
          transformed.days.push(4);
          break;
        case "Fri":
          transformed.days.push(5);
          break;
        case "Sat":
          transformed.days.push(6);
          break;
        case "Sun":
          transformed.days.push(7);
          break;
        default:
          return null;
      }
    });
  }
  if (opening) {
    const noMeridiem = opening.slice(0, opening.length - 2);
    if (opening.slice(opening.length - 2, opening.length) === "am") {
      if (noMeridiem.length < 4) {
        transformed.opening = "0" + noMeridiem;
      } else {
        transformed.opening = noMeridiem;
      }
    } else {
      transformed.opening = (parseInt(noMeridiem[0]) + 12).toString() + noMeridiem.slice(1, 3);
    }
  }
  if (closing) {
    const noMeridiem = closing.slice(0, closing.length - 2);
    if (closing.slice(closing.length - 2, closing.length) === "am") {
      if (noMeridiem.length < 4) {
        transformed.closing = "0" + noMeridiem;
      } else {
        transformed.closing = noMeridiem;
      }
    } else {
      transformed.closing = (parseInt(noMeridiem[0]) + 12).toString() + noMeridiem.slice(1, 3);
    }
  }
  return transformed;
};

module.exports = { toDayAndTime, toStorageFormat };
