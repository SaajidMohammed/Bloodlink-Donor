export const handleRespond = async (requestId) => {
  try {
    await respondToRequest(requestId);
    toast.success("Status updated to 'Donor Found'. Please head to the hospital!");
    // Refresh the feed to show the updated status locally
    fetchEmergencyRequests(); 
  } catch (err) {
    toast.error("Failed to respond to request.");
  }
};