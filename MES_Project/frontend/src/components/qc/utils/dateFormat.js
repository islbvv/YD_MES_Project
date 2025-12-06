// dateUtils.js
import { DateTime } from 'luxon';

export function dateTime() {
    return DateTime.now().setZone('Asia/Seoul').toFormat('yyyy-MM-dd HH:mm:ss');
}
