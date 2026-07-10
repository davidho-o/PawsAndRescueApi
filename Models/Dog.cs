namespace PawsAndRescueApi.Models
{
  public class Dog
  {
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Breed { get; set; } = string.Empty;
    public string Temperament { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string PhotoUrl { get; set; } = string.Empty;
  }
}