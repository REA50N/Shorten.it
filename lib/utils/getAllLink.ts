export const getAllLink = async () => {
  try {
    const response = await fetch("/api/short");
    const data = await response.json();
    return data.allLinks;
  } catch (error) {
    console.error(error);
    return [];
  }
}