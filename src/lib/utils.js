export const decodeBase64Id = (encodedId) => {
    const decodedString = atob(encodedId);
    const parts = decodedString.split(':');
    return parts[1];
  };
  