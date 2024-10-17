namespace api
{
  public class PostNotFoundException : Exception
  {
    public PostNotFoundException(string message) : base(message)
    {

    }
  }
  public class MissingFileImageException : Exception
  {
    public MissingFileImageException(string message) : base(message)
    {

    }
  }

  public class ImagePostNotFound : Exception
  {
    public ImagePostNotFound(string message) : base(message)
    {

    }
  }
}