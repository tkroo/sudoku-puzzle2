export function humanReadableTime(startingSeconds) {
	let remaining = startingSeconds;
	
	// get hours and subtract from total
	// 3600 seconds in 1 hour
	const hours = Math.floor(remaining / 3600)
	if (hours >= 1) {
		remaining -= hours * 3600
	}
	const minutes = Math.floor(remaining / 60);
	if (minutes >= 1) {
		remaining -= minutes * 60;
	}
	
	const seconds = remaining;
	
	if (
		seconds === 0 && 
		minutes === 0 && 
		hours === 0
	) {
		return '';
	}
	const usePlural = (time) => time > 1 ? 's': ''
	const hourString = hours === 0 ? '' : `${hours} hour${usePlural(hours)} `;
	const minuteString = minutes === 0 ? '' : `${minutes} minute${usePlural(minutes)} `;
	const secondsString = seconds === 0 ? '' : `${seconds} second${usePlural(seconds)} `;
	
	return `${hourString}${minuteString}${secondsString}`
}

// export function secondsToHumanReadableTime(seconds) {
//   // Ensure seconds is a valid number
//   seconds = Math.floor(Math.max(seconds, 0));

//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const remainingSeconds = seconds % 60;

//   // Add leading zeros for single-digit values
//   const formattedHours = hours.toString().padStart(2, '0');
//   const formattedMinutes = minutes.toString().padStart(2, '0');
//   const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

//   // Build the output string
//   let output = '';
//   if (hours > 0) {
//     output += `${formattedHours}h `;
//   }
//   if (minutes > 0) {
//     output += `${formattedMinutes}m `;
//   }
//   output += `${formattedSeconds}s`;

//   return output.trim();
// }