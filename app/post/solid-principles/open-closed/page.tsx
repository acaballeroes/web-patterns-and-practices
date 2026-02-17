import { PostLayout } from "@/components/post-layout";
import { CodeBlock } from "@/components/code-block";
import { getArticlesByPostAndSlug } from "@/lib/blog-data";

export const metadata = {
  title: "Open/Closed Principle - SOLID Principles",
  description:
    "Master the Open/Closed Principle through real-world examples. Learn how to design systems that are open for extension but closed for modification using the Strategy pattern.",
};

export default function Page() {
  const article = getArticlesByPostAndSlug("solid-principles", "open-closed");

  if (!article) {
    return <div></div>;
  }

  return (
    <PostLayout
      title={article.title}
      date={article.date}
      category={article.category}
      excerpt={article.excerpt}
    >
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-base leading-relaxed text-foreground/80">
        {/* Introduction */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Introduction</h2>
          <p>
            The Open/Closed Principle (OCP) states:{" "}
            <span className="font-semibold">
              a class should be open for extension but closed for modification
            </span>
            . At first glance, this seems contradictory. How can something be
            both open and closed?
          </p>
          <p>
            The answer lies in abstraction. OCP means you should add new
            behavior without rewriting existing code. When a new requirement
            arrives, you extend the system through new implementations—not by
            editing classes that already work.
          </p>
          <p>
            This principle is powerful because every time you modify existing
            code, you risk introducing bugs and breaking tests. By designing for
            extension, you keep proven logic sealed off from change.
          </p>
          <p>
            In this article, we examine OCP through real scenarios: image
            storage systems and session export formats. We show how to take a
            violation and refactor it using the Strategy pattern.
          </p>
        </div>

        {/* The Problem */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            The Problem: Modification-Driven Design
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            A Simple Example: Payment Processing
          </h3>

          <p>
            Before diving into a real application, let&apos;s see a simple,
            classic example: processing payments with different methods. This
            illustrates OCP without needing complex context.
          </p>

          <h4 className="text-base font-semibold text-foreground mt-4">
            Without OCP: Switch Statements for Each Payment Method
          </h4>

          <CodeBlock language="csharp">{`public class PaymentProcessor
{
    public decimal ProcessPayment(string paymentMethod, decimal amount)
    {
        switch (paymentMethod.ToLower())
        {
            case "creditcard":
                return ProcessCreditCard(amount);
            
            case "paypal":
                return ProcessPayPal(amount);
            
            case "cryptocurrency":
                // New payment method? Modify this class
                throw new NotSupportedException("Crypto not yet supported");
            
            default:
                throw new NotSupportedException(
                    $"Payment method '{paymentMethod}' not supported");
        }
    }

    private decimal ProcessCreditCard(decimal amount)
    {
        // Validate card, charge, return fee
        return amount * 0.029m; // 2.9% fee
    }

    private decimal ProcessPayPal(decimal amount)
    {
        // Call PayPal API, process, return fee
        return amount * 0.034m; // 3.4% fee
    }
}`}</CodeBlock>

          <p className="mt-4">
            <span className="font-semibold">The problem:</span> Every new
            payment method requires modifying PaymentProcessor. Each
            modification risks breaking existing methods. Testing is complex
            because you test all methods together.
          </p>

          <h4 className="text-base font-semibold text-foreground mt-4">
            With OCP: Strategy Pattern
          </h4>

          <CodeBlock language="csharp">{`// Define the contract
public interface IPaymentMethod
{
    decimal ProcessPayment(decimal amount);
}

// Each payment method is its own class
public class CreditCardPaymentMethod : IPaymentMethod
{
    public decimal ProcessPayment(decimal amount)
    {
        // Credit card logic isolated here
        return amount * 0.029m;
    }
}

public class PayPalPaymentMethod : IPaymentMethod
{
    public decimal ProcessPayment(decimal amount)
    {
        // PayPal logic isolated here
        return amount * 0.034m;
    }
}

// New payment method - NO modification to existing code
public class CryptocurrencyPaymentMethod : IPaymentMethod
{
    public decimal ProcessPayment(decimal amount)
    {
        // Crypto logic isolated here
        return amount * 0.001m;
    }
}

// The processor is closed for modification
public class PaymentProcessor
{
    private readonly IPaymentMethodFactory _paymentMethodFactory;

    public decimal ProcessPayment(string paymentMethod, decimal amount)
    {
        var method = _paymentMethodFactory.GetPaymentMethod(paymentMethod);
        
        if (method == null)
            throw new NotSupportedException(
                $"Payment method '{paymentMethod}' not supported");
        
        return method.ProcessPayment(amount);
    }
}`}</CodeBlock>

          <p className="mt-4">
            Now adding a new payment method (Bitcoin, Apple Pay, Google Pay) is
            just a new class. PaymentProcessor never changes.
          </p>
        </div>

        {/* Case Study: Gathering */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Case Study: Image Storage in Gathering
          </h2>

          <p>
            The Gathering application (a Community of Practice management
            system) needs to store images (session banners, community logos).
            Initially, Azure Blob Storage is the choice. But scaling to multiple
            regions and cloud providers requires AWS S3, Google Cloud Storage,
            or local storage options.
          </p>

          <p>
            Without OCP, you end up modifying the storage service repeatedly.
            Let&apos;s see how Gathering solves this with the Strategy pattern.
          </p>

          <h4 className="text-base font-semibold text-foreground mt-4">
            The Violation: Storage-Specific Logic Mixed Together
          </h4>

          <CodeBlock language="csharp">{`public class ImageStorageService
{
    private readonly ILogger _logger;

    // This method must be modified for each new provider
    public async Task<Result<string>> UploadImageAsync(
        string storageProvider, Stream imageStream, string fileName)
    {
        switch (storageProvider.ToLower())
        {
            case "azure":
                return await UploadToAzureAsync(imageStream, fileName);
            
            case "aws":
                // New provider? Modify this class
                _logger.LogError("AWS S3 not yet implemented");
                return Result.Failure<string>("Not supported");
            
            case "gcs":
                // Another provider? Modify again
                _logger.LogError("GCS not yet implemented");
                return Result.Failure<string>("Not supported");
            
            default:
                throw new NotSupportedException(
                    $"Storage provider '{storageProvider}' not supported");
        }
    }

    private async Task<Result<string>> UploadToAzureAsync(
        Stream imageStream, string fileName)
    {
        var blobClient = new BlobClient(
            new Uri("https://account.blob.core.windows.net/images/file.jpg"));
        await blobClient.UploadAsync(imageStream);
        return Result.Success(blobClient.Uri.AbsoluteUri);
    }
}`}</CodeBlock>

          <p className="mt-4">
            <span className="font-semibold">The problem:</span> Every time you
            need a new storage provider, you must:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Open the ImageStorageService class</li>
            <li>Add a new case to the switch statement</li>
            <li>Implement the provider logic inline</li>
            <li>Test the entire class again</li>
            <li>Risk regression in existing providers</li>
          </ul>

          <p className="mt-4">
            This violates OCP: the class is closed for modification in theory
            but open in practice. Every new feature forces you to reopen and
            change it.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            The Right Approach: Define an Abstraction
          </h3>

          <p>
            Gathering solves this elegantly by making storage pluggable. The key
            is defining an abstraction that all storage providers implement.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Step 1: Define the Contract
          </h3>

          <CodeBlock language="csharp">{`// Every storage provider implements this interface
public interface IImageStorageService
{
    Task<Result<string>> UploadImageAsync(
        Stream imageStream,
        string fileName,
        CancellationToken cancellationToken = default);

    Task<Result> DeleteImageAsync(
        string imageUrl, 
        CancellationToken cancellationToken = default);
}`}</CodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Step 2: Implement for Azure
          </h3>

          <CodeBlock language="csharp">{`public sealed class AzureBlobStorageService : IImageStorageService
{
    private const string ContainerName = "images";
    private readonly BlobServiceClient _blobServiceClient;

    public AzureBlobStorageService(BlobServiceClient blobServiceClient)
    {
        _blobServiceClient = blobServiceClient;
    }

    public async Task<Result<string>> UploadImageAsync(
        Stream imageStream, string fileName, CancellationToken cancellationToken = default)
    {
        try
        {
            var containerClient = _blobServiceClient
                .GetBlobContainerClient(ContainerName);
            await containerClient.CreateIfNotExistsAsync(
                cancellationToken: cancellationToken);

            var extension = Path.GetExtension(fileName).ToLower();
            var blobName = $"{Guid.NewGuid()}{extension}";
            var blobClient = containerClient.GetBlobClient(blobName);

            imageStream.Seek(0, SeekOrigin.Begin);

            await blobClient.UploadAsync(imageStream, cancellationToken);
            return Result.Success(blobClient.Uri.AbsoluteUri);
        }
        catch (Exception ex)
        {
            return Result.Failure<string>($"Upload failed: {ex.Message}");
        }
    }

    public async Task<Result> DeleteImageAsync(
        string imageUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var uri = new Uri(imageUrl);
            var blobClient = new BlobClient(uri);
            await blobClient.DeleteIfExistsAsync(
                cancellationToken: cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Delete failed: {ex.Message}");
        }
    }
}`}</CodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Step 3: Add AWS S3 - No Modification of Existing Code!
          </h3>

          <CodeBlock language="csharp">{`// New implementation - existing code never changes
public sealed class AwsS3StorageService : IImageStorageService
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public AwsS3StorageService(IAmazonS3 s3Client, string bucketName)
    {
        _s3Client = s3Client;
        _bucketName = bucketName;
    }

    public async Task<Result<string>> UploadImageAsync(
        Stream imageStream, string fileName, CancellationToken cancellationToken = default)
    {
        try
        {
            var key = $"{Guid.NewGuid()}{Path.GetExtension(fileName).ToLower()}";

            var putRequest = new PutObjectRequest
            {
                BucketName = _bucketName,
                Key = key,
                InputStream = imageStream
            };

            await _s3Client.PutObjectAsync(putRequest, cancellationToken);
            return Result.Success($"https://{_bucketName}.s3.amazonaws.com/{key}");
        }
        catch (Exception ex)
        {
            return Result.Failure<string>($"Upload failed: {ex.Message}");
        }
    }

    public async Task<Result> DeleteImageAsync(
        string imageUrl, CancellationToken cancellationToken = default)
    {
        try
        {
            var uri = new Uri(imageUrl);
            var key = uri.LocalPath.TrimStart('/');
            
            await _s3Client.DeleteObjectAsync(_bucketName, key, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Delete failed: {ex.Message}");
        }
    }
}`}</CodeBlock>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            Step 4: The Handler Depends on the Abstraction
          </h3>

          <p>
            Notice: the handler never changes, even when new storage providers
            are added.
          </p>

          <CodeBlock language="csharp">{`public class CreateSessionCommandHandler : ICommandHandler<CreateSessionCommand>
{
    private readonly IImageStorageService _imageStorageService;

    public async Task<Result> HandleAsync(CreateSessionCommand request, 
        CancellationToken cancellationToken = default)
    {
        string? imageUrl = null;
        if (request.ImageStream is not null)
        {
            // Works with ANY provider - Azure, AWS, GCS, local file, whatever
            var uploadResult = await _imageStorageService.UploadImageAsync(
                request.ImageStream,
                request.ImageFileName,
                cancellationToken);

            if (uploadResult.IsFailure)
                return Result.Failure(uploadResult.Error);

            imageUrl = uploadResult.Value;
        }

        // Creates session with imageUrl
        return Result.Success();
    }
}`}</CodeBlock>

          <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
            <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
              ✓ Benefits of OCP Here:
            </p>
            <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
              <li>
                <span className="font-semibold">Closed for modification:</span>{" "}
                CreateSessionCommandHandler never changes.
              </li>
              <li>
                <span className="font-semibold">Open for extension:</span> Add
                GoogleCloudStorageService and register it. No existing code
                touched.
              </li>
              <li>
                <span className="font-semibold">Easy to test:</span> Test each
                provider independently with mocks.
              </li>
              <li>
                <span className="font-semibold">No risk:</span> A bug in AWS
                code cannot affect Azure.
              </li>
            </ul>
          </div>
        </div>

        {/* Another Example */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Another Example: Session Export Formats
          </h2>

          <p>
            The same pattern applies anywhere you have variation. Here is
            another scenario: exporting session data in multiple formats (CSV,
            JSON, XML, PDF).
          </p>

          <h4 className="text-base font-semibold text-foreground mt-4">
            Without OCP
          </h4>

          <CodeBlock language="csharp">{`public class SessionExportService
{
    public async Task<Result<string>> ExportSessionsAsync(
        Guid communityId, string format)
    {
        var sessions = await _sessionRepository.GetByCommunityAsync(communityId);

        switch (format.ToLower())
        {
            case "csv":
                return GenerateCsv(sessions);
            case "json":
                return GenerateJson(sessions);
            case "xml":
                // New format? Modify this class
                return Result.Failure<string>("XML not supported");
            case "pdf":
                // Another format? Modify again
                return Result.Failure<string>("PDF not supported");
            default:
                throw new NotSupportedException();
        }
    }
}`}</CodeBlock>

          <h4 className="text-base font-semibold text-foreground mt-4">
            With OCP
          </h4>

          <CodeBlock language="csharp">{`// Define the abstraction
public interface ISessionExportFormatter
{
    string FormatName { get; }
    Task<Result<string>> ExportAsync(IEnumerable<Session> sessions);
}

// Each format is its own class
public class CsvSessionExportFormatter : ISessionExportFormatter
{
    public string FormatName => "csv";

    public Task<Result<string>> ExportAsync(IEnumerable<Session> sessions)
    {
        var csv = "Title,Speaker,Date";
        foreach (var session in sessions)
        {
            csv += session.Title + "," + session.Speaker + "," + 
                   session.Schedule;
        }
        return Task.FromResult(Result.Success(csv));
    }
}

public class JsonSessionExportFormatter : ISessionExportFormatter
{
    public string FormatName => "json";

    public Task<Result<string>> ExportAsync(IEnumerable<Session> sessions)
    {
        var json = JsonConvert.SerializeObject(sessions, Formatting.Indented);
        return Task.FromResult(Result.Success(json));
    }
}

public class XmlSessionExportFormatter : ISessionExportFormatter
{
    public string FormatName => "xml";

    public Task<Result<string>> ExportAsync(IEnumerable<Session> sessions)
    {
        var doc = new XDocument(
            new XElement("Sessions",
                sessions.Select(s => new XElement("Session",
                    new XElement("Title", s.Title),
                    new XElement("Speaker", s.Speaker)
                ))
            )
        );
        return Task.FromResult(Result.Success(doc.ToString()));
    }
}

// The service is closed for modification
public class SessionExportService
{
    private readonly ISessionRepository _sessionRepository;
    private readonly ISessionExportFormatterFactory _formatterFactory;

    public async Task<Result<string>> ExportSessionsAsync(
        Guid communityId, string format)
    {
        var formatter = _formatterFactory.GetFormatter(format);
        
        if (formatter == null)
            return Result.Failure<string>("Format not supported");

        var sessions = await _sessionRepository.GetByCommunityAsync(communityId);
        return await formatter.ExportAsync(sessions);
    }
}`}</CodeBlock>

          <p className="mt-4">
            To add PDF export: create PdfSessionExportFormatter, register it in
            the factory. SessionExportService never changes.
          </p>
        </div>

        {/* Understanding OCP */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Understanding the Open/Closed Principle
          </h2>

          <p>OCP has two dimensions:</p>
          <ul className="list-disc list-inside space-y-3 my-4">
            <li>
              <span className="font-semibold">Closed for modification:</span>{" "}
              Changes to existing behavior should not require editing existing
              code.
            </li>
            <li>
              <span className="font-semibold">Open for extension:</span> New
              behavior is added by creating new code, not modifying old code.
            </li>
          </ul>

          <p>
            The mechanism is <span className="font-semibold">abstraction</span>.
            By defining an interface, you create a contract. New implementations
            satisfy the contract without changing the original code.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-6">
            The Pattern: How OCP Works
          </h3>

          <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-4 dark:bg-blue-950/30">
            <ol className="list-decimal list-inside space-y-3 text-sm text-blue-900 dark:text-blue-100">
              <li>
                <span className="font-semibold">
                  Identify variation points:
                </span>{" "}
                Where do different implementations differ?
              </li>
              <li>
                <span className="font-semibold">Extract an abstraction:</span>{" "}
                Define an interface all implementations must satisfy.
              </li>
              <li>
                <span className="font-semibold">Create implementations:</span>{" "}
                Each variation becomes its own class.
              </li>
              <li>
                <span className="font-semibold">
                  Depend on the abstraction:
                </span>{" "}
                Your handler depends on the interface, not concrete classes.
              </li>
              <li>
                <span className="font-semibold">Wire via DI:</span> Register
                implementations at startup.
              </li>
            </ol>
          </div>
        </div>

        {/* TypeScript Example */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            TypeScript Example
          </h2>

          <p>
            The same pattern applies in TypeScript. Here is image storage in
            Node.js/Express:
          </p>

          <CodeBlock language="typescript">
            {`// The abstraction
interface IImageStorageService {
  uploadImage(
    stream: NodeJS.ReadableStream,
    fileName: string
  ): Promise<Result<string>>;

  deleteImage(imageUrl: string): Promise<Result<void>>;
}

// Azure implementation
class AzureImageStorageService implements IImageStorageService {
  constructor(private blobServiceClient: BlobServiceClient) {}

  async uploadImage(
    stream: NodeJS.ReadableStream,
    fileName: string
  ): Promise<Result<string>> {
    const containerClient = this.blobServiceClient
      .getContainerClient("images");
    const extension = fileName.slice(fileName.lastIndexOf("."));
    const blobName = crypto.randomUUID() + extension;
    const blobClient = containerClient.getBlockBlobClient(blobName);

    await blobClient.uploadStream(stream);
    return success(blobClient.url);
  }

  async deleteImage(imageUrl: string): Promise<Result<void>> {
    const blobClient = new BlobClient(imageUrl);
    await blobClient.delete();
    return success(undefined);
  }
}

// AWS implementation - new file, no changes to existing code
class AwsS3ImageStorageService implements IImageStorageService {
  constructor(private s3Client: S3Client, private bucketName: string) {}

  async uploadImage(
    stream: NodeJS.ReadableStream,
    fileName: string
  ): Promise<Result<string>> {
    const extension = fileName.slice(fileName.lastIndexOf("."));
    const key = crypto.randomUUID() + extension;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: stream,
    });

    await this.s3Client.send(command);
    const url = "https://" + this.bucketName + ".s3.amazonaws.com/" + key;
    return success(url);
  }

  async deleteImage(imageUrl: string): Promise<Result<void>> {
    const url = new URL(imageUrl);
    const key = url.pathname.slice(1);

    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
    return success(undefined);
  }
}

// Handler depends on the abstraction
class CreateSessionHandler {
  constructor(private imageStorageService: IImageStorageService) {}

  async handle(request: CreateSessionRequest): Promise<Result<Session>> {
    let imageUrl: string | undefined;

    if (request.imageStream) {
      const result = await this.imageStorageService.uploadImage(
        request.imageStream,
        request.imageFileName
      );

      if (!result.isSuccess) {
        return failure("Image upload failed");
      }

      imageUrl = result.value;
    }

    return success(session);
  }
}`}
          </CodeBlock>
        </div>

        {/* Benefits */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Benefits of Applying OCP
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            1. Lower Risk of Regressions
          </h3>
          <p>
            By adding new classes instead of modifying existing ones, you keep
            proven logic sealed off. Azure storage continues to work because you
            never touched that code.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            2. Easier Testing
          </h3>
          <p>
            Test each implementation independently. An AwsS3StorageService test
            does not need to know about Azure. Tests are smaller and focused.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            3. Scalability
          </h3>
          <p>
            As the system grows, the core service stays small. Only the number
            of implementations grows, each in its own file with its own tests.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            4. Parallel Development
          </h3>
          <p>
            Developers can work on different implementations simultaneously. The
            interface clearly defines what must be implemented.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            5. Runtime Flexibility
          </h3>
          <p>
            With dependency injection, you can swap implementations without code
            changes. Use Azure in production, local storage in tests.
          </p>
        </div>

        {/* Pitfalls */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Real-World Pitfalls
          </h2>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            Pitfall 1: Over-Abstraction
          </h3>
          <p>
            Not everything needs an interface. Ask: &ldquo;Will this have
            multiple implementations?&rdquo; If no, keep it simple. Only
            abstract variation points.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            Pitfall 2: Leaky Abstractions
          </h3>
          <p>
            If your interface exposes implementation details, subclasses
            struggle. Keep the interface focused and clear.
          </p>

          <h3 className="text-lg font-semibold text-foreground mt-4">
            Pitfall 3: Factory Explosion
          </h3>
          <p>
            Keep the factory simple: it maps strings to implementations. Use
            dependency injection to inject implementations, not instantiate them
            inside the factory.
          </p>
        </div>

        {/* Checklist */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Checklist: Detecting OCP Violations
          </h2>

          <div className="space-y-3 my-4">
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                Do you have large switch statements checking types or formats?
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                When new variants arrive, do you modify existing classes?
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                Is there a service class that knows about all variants?
              </label>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-4">
              <input
                type="checkbox"
                className="mt-1"
                disabled
                readOnly
                defaultChecked
              />
              <label>
                Would adding a feature require modifying multiple existing
                classes?
              </label>
            </div>
          </div>

          <p>
            If you answer &ldquo;yes&rdquo; to any of these, OCP is likely being
            violated.
          </p>
        </div>

        {/* Conclusion */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Conclusion</h2>

          <p>
            The Open/Closed Principle transforms how you think about adding
            features. Instead of modifying existing code (risky, fragile), you
            extend through new implementations (safe, isolated).
          </p>

          <p>
            The mechanism is abstraction: define a clear interface, then create
            new implementations. Existing code never changes. Tests never need
            re-running. Risk is minimized.
          </p>

          <p>
            OCP enables parallel development, easier testing, and lower
            regressions. It scales naturally: adding the tenth storage provider
            is as safe as adding the second.
          </p>

          <p>
            The key insight:{" "}
            <span className="font-semibold">
              design for extension through abstraction, not for modification
              through inspection
            </span>
            .
          </p>

          <p>
            In the next article, we explore the Liskov Substitution Principle,
            which ensures that derived types are safe to use in place of their
            base types—a crucial property for OCP to work reliably.
          </p>
        </div>
      </div>
    </PostLayout>
  );
}
