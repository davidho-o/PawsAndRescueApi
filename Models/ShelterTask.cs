namespace PawsAndRescueApi.Models;

public class ShelterTask
{
  public int Id { get; set; }

  public string Description { get; set; } = string.Empty;

  public bool IsCompleted { get; set; } = false;

  // de ce tura apartine acest task
  public int ShiftId { get; set; }

  // la ce caine se refera task-ul
  public int DogId { get; set; }
}