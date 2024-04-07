function isLockError(err) {
    if (err.code === '40001' || err.code === '55P03' || err.code === '55P04') {
        return true;
    }

    // Check if the error message contains keywords indicative of lock contention
    const errorMessage = err.message.toLowerCase();
    const lockKeywords = ['lock', 'deadlock', 'contention', 'timeout', 'not available'];
    return lockKeywords.some(keyword => errorMessage.includes(keyword));
}

module.exports = isLockError;