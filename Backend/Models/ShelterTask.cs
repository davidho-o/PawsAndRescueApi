namespace PawsAndRescueApi.Models;

public class ShelterTask
{
  public int Id { get; set; }

  public string Description { get; set; } = string.Empty;

  public bool IsCompleted { get; set; } = false;

  // what shift contains this id
  public int ShiftId { get; set; }

  // what dog does this tasl cater to
  public int DogId { get; set; }
}