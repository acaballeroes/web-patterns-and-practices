import { CodeBlock } from "@/components/code-block";

export function OcpContentEs() {
  return (
    <>
      {/* Introducción */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Introducción</h2>
        <p>
          El Principio de Abierto/Cerrado (OCP) establece:{" "}
          <span className="font-semibold">
            una clase debe estar abierta para extensión pero cerrada para
            modificación
          </span>
          . A primera vista, esto parece contradictorio. ¿Cómo puede algo estar
          abierto y cerrado a la vez?
        </p>
        <p>
          La respuesta está en la abstracción. OCP significa que debes agregar
          nuevo comportamiento sin reescribir código existente. Cuando llega un
          nuevo requerimiento, extiendes el sistema a través de nuevas
          implementaciones, no editando clases que ya funcionan.
        </p>
        <p>
          Este principio es poderoso porque cada vez que modificas código
          existente, arriesgas introducir bugs y romper pruebas. Al diseñar para
          extensión, mantienes la lógica probada sellada contra cambios.
        </p>
        <p>
          En este artículo, examinamos OCP a través de escenarios reales:
          sistemas de almacenamiento de imágenes y formatos de exportación de
          sesiones. Mostramos cómo tomar una violación y refactorizarla usando
          el patrón Strategy.
        </p>
      </div>

      {/* El Problema */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          El Problema: Diseño Orientado a la Modificación
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Un Ejemplo Simple: Procesamiento de Pagos
        </h3>

        <p>
          Antes de sumergirnos en una aplicación real, veamos un ejemplo simple
          y clásico: procesar pagos con diferentes métodos. Esto ilustra OCP sin
          necesitar contexto complejo.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Sin OCP: Sentencias Switch para Cada Método de Pago
        </h4>

        <CodeBlock language="csharp">
          {
            'public class PaymentProcessor\n{\n    public decimal ProcessPayment(string paymentMethod, decimal amount)\n    {\n        switch (paymentMethod.ToLower())\n        {\n            case "creditcard":\n                return ProcessCreditCard(amount);\n            \n            case "paypal":\n                return ProcessPayPal(amount);\n            \n            case "cryptocurrency":\n                // ¿Nuevo método de pago? Modificar esta clase\n                throw new NotSupportedException("Crypto aún no soportado");\n            \n            default:\n                throw new NotSupportedException(\n                    $"Método de pago \'{paymentMethod}\' no soportado");\n        }\n    }\n\n    private decimal ProcessCreditCard(decimal amount)\n    {\n        // Validar tarjeta, cobrar, retornar comisión\n        return amount * 0.029m; // 2.9% comisión\n    }\n\n    private decimal ProcessPayPal(decimal amount)\n    {\n        // Llamar API de PayPal, procesar, retornar comisión\n        return amount * 0.034m; // 3.4% comisión\n    }\n}'
          }
        </CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">El problema:</span> Cada nuevo método
          de pago requiere modificar PaymentProcessor. Cada modificación
          arriesga romper métodos existentes. Las pruebas son complejas porque
          pruebas todos los métodos juntos.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Con OCP: Patrón Strategy
        </h4>

        <CodeBlock language="csharp">
          {
            "// Definir el contrato\npublic interface IPaymentMethod\n{\n    decimal ProcessPayment(decimal amount);\n}\n\n// Cada método de pago es su propia clase\npublic class CreditCardPaymentMethod : IPaymentMethod\n{\n    public decimal ProcessPayment(decimal amount)\n    {\n        // Lógica de tarjeta de crédito aislada aquí\n        return amount * 0.029m;\n    }\n}\n\npublic class PayPalPaymentMethod : IPaymentMethod\n{\n    public decimal ProcessPayment(decimal amount)\n    {\n        // Lógica de PayPal aislada aquí\n        return amount * 0.034m;\n    }\n}\n\n// Nuevo método de pago - SIN modificación del código existente\npublic class CryptocurrencyPaymentMethod : IPaymentMethod\n{\n    public decimal ProcessPayment(decimal amount)\n    {\n        // Lógica de crypto aislada aquí\n        return amount * 0.001m;\n    }\n}\n\n// El procesador está cerrado para modificación\npublic class PaymentProcessor\n{\n    private readonly IPaymentMethodFactory _paymentMethodFactory;\n\n    public decimal ProcessPayment(string paymentMethod, decimal amount)\n    {\n        var method = _paymentMethodFactory.GetPaymentMethod(paymentMethod);\n        \n        if (method == null)\n            throw new NotSupportedException(\n                $\"Método de pago '{paymentMethod}' no soportado\");\n        \n        return method.ProcessPayment(amount);\n    }\n}"
          }
        </CodeBlock>

        <p className="mt-4">
          Ahora agregar un nuevo método de pago (Bitcoin, Apple Pay, Google Pay)
          es solo una nueva clase. PaymentProcessor nunca cambia.
        </p>
      </div>

      {/* Caso de Estudio: Gathering */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Caso de Estudio: Almacenamiento de Imágenes en Gathering
        </h2>

        <p>
          La aplicación Gathering (un sistema de gestión de Comunidades de
          Práctica) necesita almacenar imágenes (banners de sesiones, logos de
          comunidades). Inicialmente, Azure Blob Storage es la opción. Pero
          escalar a múltiples regiones y proveedores de nube requiere AWS S3,
          Google Cloud Storage u opciones de almacenamiento local.
        </p>

        <p>
          Sin OCP, terminas modificando el servicio de almacenamiento
          repetidamente. Veamos cómo Gathering resuelve esto con el patrón
          Strategy.
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          La Violación: Lógica Específica de Almacenamiento Mezclada
        </h4>

        <CodeBlock language="csharp">
          {
            'public class ImageStorageService\n{\n    private readonly ILogger _logger;\n\n    // Este método debe modificarse para cada nuevo proveedor\n    public async Task<Result<string>> UploadImageAsync(\n        string storageProvider, Stream imageStream, string fileName)\n    {\n        switch (storageProvider.ToLower())\n        {\n            case "azure":\n                return await UploadToAzureAsync(imageStream, fileName);\n            \n            case "aws":\n                // ¿Nuevo proveedor? Modificar esta clase\n                _logger.LogError("AWS S3 aún no implementado");\n                return Result.Failure<string>("No soportado");\n            \n            case "gcs":\n                // ¿Otro proveedor? Modificar de nuevo\n                _logger.LogError("GCS aún no implementado");\n                return Result.Failure<string>("No soportado");\n            \n            default:\n                throw new NotSupportedException(\n                    $"Proveedor de almacenamiento \'{storageProvider}\' no soportado");\n        }\n    }\n\n    private async Task<Result<string>> UploadToAzureAsync(\n        Stream imageStream, string fileName)\n    {\n        var blobClient = new BlobClient(\n            new Uri("https://account.blob.core.windows.net/images/file.jpg"));\n        await blobClient.UploadAsync(imageStream);\n        return Result.Success(blobClient.Uri.AbsoluteUri);\n    }\n}'
          }
        </CodeBlock>

        <p className="mt-4">
          <span className="font-semibold">El problema:</span> Cada vez que
          necesitas un nuevo proveedor de almacenamiento, debes:
        </p>
        <ul className="list-disc list-inside space-y-2">
          <li>Abrir la clase ImageStorageService</li>
          <li>Agregar un nuevo caso al switch</li>
          <li>Implementar la lógica del proveedor inline</li>
          <li>Probar toda la clase de nuevo</li>
          <li>Arriesgar regresión en proveedores existentes</li>
        </ul>

        <p className="mt-4">
          Esto viola OCP: la clase está cerrada para modificación en teoría pero
          abierta en práctica. Cada nueva funcionalidad te obliga a reabrirla y
          cambiarla.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Enfoque Correcto: Definir una Abstracción
        </h3>

        <p>
          Gathering resuelve esto elegantemente haciendo el almacenamiento
          enchufable. La clave es definir una abstracción que todos los
          proveedores de almacenamiento implementen.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 1: Definir el Contrato
        </h3>

        <CodeBlock language="csharp">
          {
            "// Cada proveedor de almacenamiento implementa esta interfaz\npublic interface IImageStorageService\n{\n    Task<Result<string>> UploadImageAsync(\n        Stream imageStream,\n        string fileName,\n        CancellationToken cancellationToken = default);\n\n    Task<Result> DeleteImageAsync(\n        string imageUrl, \n        CancellationToken cancellationToken = default);\n}"
          }
        </CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 2: Implementar para Azure
        </h3>

        <CodeBlock language="csharp">
          {
            'public sealed class AzureBlobStorageService : IImageStorageService\n{\n    private const string ContainerName = "images";\n    private readonly BlobServiceClient _blobServiceClient;\n\n    public AzureBlobStorageService(BlobServiceClient blobServiceClient)\n    {\n        _blobServiceClient = blobServiceClient;\n    }\n\n    public async Task<Result<string>> UploadImageAsync(\n        Stream imageStream, string fileName, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var containerClient = _blobServiceClient\n                .GetBlobContainerClient(ContainerName);\n            await containerClient.CreateIfNotExistsAsync(\n                cancellationToken: cancellationToken);\n\n            var extension = Path.GetExtension(fileName).ToLower();\n            var blobName = $"{Guid.NewGuid()}{extension}";\n            var blobClient = containerClient.GetBlobClient(blobName);\n\n            imageStream.Seek(0, SeekOrigin.Begin);\n\n            await blobClient.UploadAsync(imageStream, cancellationToken);\n            return Result.Success(blobClient.Uri.AbsoluteUri);\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure<string>($"Error al subir: {ex.Message}");\n        }\n    }\n\n    public async Task<Result> DeleteImageAsync(\n        string imageUrl, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var uri = new Uri(imageUrl);\n            var blobClient = new BlobClient(uri);\n            await blobClient.DeleteIfExistsAsync(\n                cancellationToken: cancellationToken);\n            return Result.Success();\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure($"Error al eliminar: {ex.Message}");\n        }\n    }\n}'
          }
        </CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 3: Agregar AWS S3 - ¡Sin Modificar Código Existente!
        </h3>

        <CodeBlock language="csharp">
          {
            '// Nueva implementación - el código existente nunca cambia\npublic sealed class AwsS3StorageService : IImageStorageService\n{\n    private readonly IAmazonS3 _s3Client;\n    private readonly string _bucketName;\n\n    public AwsS3StorageService(IAmazonS3 s3Client, string bucketName)\n    {\n        _s3Client = s3Client;\n        _bucketName = bucketName;\n    }\n\n    public async Task<Result<string>> UploadImageAsync(\n        Stream imageStream, string fileName, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var key = $"{Guid.NewGuid()}{Path.GetExtension(fileName).ToLower()}";\n\n            var putRequest = new PutObjectRequest\n            {\n                BucketName = _bucketName,\n                Key = key,\n                InputStream = imageStream\n            };\n\n            await _s3Client.PutObjectAsync(putRequest, cancellationToken);\n            return Result.Success($"https://{_bucketName}.s3.amazonaws.com/{key}");\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure<string>($"Error al subir: {ex.Message}");\n        }\n    }\n\n    public async Task<Result> DeleteImageAsync(\n        string imageUrl, CancellationToken cancellationToken = default)\n    {\n        try\n        {\n            var uri = new Uri(imageUrl);\n            var key = uri.LocalPath.TrimStart(\'/\');\n            \n            await _s3Client.DeleteObjectAsync(_bucketName, key, cancellationToken);\n            return Result.Success();\n        }\n        catch (Exception ex)\n        {\n            return Result.Failure($"Error al eliminar: {ex.Message}");\n        }\n    }\n}'
          }
        </CodeBlock>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          Paso 4: El Handler Depende de la Abstracción
        </h3>

        <p>
          Observa: el handler nunca cambia, incluso cuando se agregan nuevos
          proveedores de almacenamiento.
        </p>

        <CodeBlock language="csharp">
          {
            "public class CreateSessionCommandHandler : ICommandHandler<CreateSessionCommand>\n{\n    private readonly IImageStorageService _imageStorageService;\n\n    public async Task<Result> HandleAsync(CreateSessionCommand request, \n        CancellationToken cancellationToken = default)\n    {\n        string? imageUrl = null;\n        if (request.ImageStream is not null)\n        {\n            // Funciona con CUALQUIER proveedor - Azure, AWS, GCS, local\n            var uploadResult = await _imageStorageService.UploadImageAsync(\n                request.ImageStream,\n                request.ImageFileName,\n                cancellationToken);\n\n            if (uploadResult.IsFailure)\n                return Result.Failure(uploadResult.Error);\n\n            imageUrl = uploadResult.Value;\n        }\n\n        // Crea sesión con imageUrl\n        return Result.Success();\n    }\n}"
          }
        </CodeBlock>

        <div className="rounded-lg border border-green-600 bg-green-50 p-4 my-6 dark:bg-green-950/30">
          <p className="font-semibold text-green-900 dark:text-green-100 mb-3">
            ✓ Beneficios de OCP Aquí:
          </p>
          <ul className="text-sm text-green-900 dark:text-green-100 space-y-2">
            <li>
              <span className="font-semibold">Cerrado para modificación:</span>{" "}
              CreateSessionCommandHandler nunca cambia.
            </li>
            <li>
              <span className="font-semibold">Abierto para extensión:</span>{" "}
              Agrega GoogleCloudStorageService y regístralo. No se toca código
              existente.
            </li>
            <li>
              <span className="font-semibold">Fácil de probar:</span> Prueba
              cada proveedor independientemente con mocks.
            </li>
            <li>
              <span className="font-semibold">Sin riesgo:</span> Un bug en el
              código de AWS no puede afectar a Azure.
            </li>
          </ul>
        </div>
      </div>

      {/* Otro Ejemplo */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Otro Ejemplo: Formatos de Exportación de Sesiones
        </h2>

        <p>
          El mismo patrón aplica donde sea que tengas variación. Aquí hay otro
          escenario: exportar datos de sesiones en múltiples formatos (CSV,
          JSON, XML, PDF).
        </p>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Sin OCP
        </h4>

        <CodeBlock language="csharp">
          {
            'public class SessionExportService\n{\n    public async Task<Result<string>> ExportSessionsAsync(\n        Guid communityId, string format)\n    {\n        var sessions = await _sessionRepository.GetByCommunityAsync(communityId);\n\n        switch (format.ToLower())\n        {\n            case "csv":\n                return GenerateCsv(sessions);\n            case "json":\n                return GenerateJson(sessions);\n            case "xml":\n                // ¿Nuevo formato? Modificar esta clase\n                return Result.Failure<string>("XML no soportado");\n            case "pdf":\n                // ¿Otro formato? Modificar de nuevo\n                return Result.Failure<string>("PDF no soportado");\n            default:\n                throw new NotSupportedException();\n        }\n    }\n}'
          }
        </CodeBlock>

        <h4 className="text-base font-semibold text-foreground mt-4">
          Con OCP
        </h4>

        <CodeBlock language="csharp">
          {
            '// Definir la abstracción\npublic interface ISessionExportFormatter\n{\n    string FormatName { get; }\n    Task<Result<string>> ExportAsync(IEnumerable<Session> sessions);\n}\n\n// Cada formato es su propia clase\npublic class CsvSessionExportFormatter : ISessionExportFormatter\n{\n    public string FormatName => "csv";\n\n    public Task<Result<string>> ExportAsync(IEnumerable<Session> sessions)\n    {\n        var csv = "Título,Ponente,Fecha";\n        foreach (var session in sessions)\n        {\n            csv += session.Title + "," + session.Speaker + "," + \n                   session.Schedule;\n        }\n        return Task.FromResult(Result.Success(csv));\n    }\n}\n\npublic class JsonSessionExportFormatter : ISessionExportFormatter\n{\n    public string FormatName => "json";\n\n    public Task<Result<string>> ExportAsync(IEnumerable<Session> sessions)\n    {\n        var json = JsonConvert.SerializeObject(sessions, Formatting.Indented);\n        return Task.FromResult(Result.Success(json));\n    }\n}\n\npublic class XmlSessionExportFormatter : ISessionExportFormatter\n{\n    public string FormatName => "xml";\n\n    public Task<Result<string>> ExportAsync(IEnumerable<Session> sessions)\n    {\n        var doc = new XDocument(\n            new XElement("Sessions",\n                sessions.Select(s => new XElement("Session",\n                    new XElement("Title", s.Title),\n                    new XElement("Speaker", s.Speaker)\n                ))\n            )\n        );\n        return Task.FromResult(Result.Success(doc.ToString()));\n    }\n}\n\n// El servicio está cerrado para modificación\npublic class SessionExportService\n{\n    private readonly ISessionRepository _sessionRepository;\n    private readonly ISessionExportFormatterFactory _formatterFactory;\n\n    public async Task<Result<string>> ExportSessionsAsync(\n        Guid communityId, string format)\n    {\n        var formatter = _formatterFactory.GetFormatter(format);\n        \n        if (formatter == null)\n            return Result.Failure<string>("Formato no soportado");\n\n        var sessions = await _sessionRepository.GetByCommunityAsync(communityId);\n        return await formatter.ExportAsync(sessions);\n    }\n}'
          }
        </CodeBlock>

        <p className="mt-4">
          Para agregar exportación PDF: crea PdfSessionExportFormatter,
          regístralo en la factory. SessionExportService nunca cambia.
        </p>
      </div>

      {/* Entendiendo OCP */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Entendiendo el Principio de Abierto/Cerrado
        </h2>

        <p>OCP tiene dos dimensiones:</p>
        <ul className="list-disc list-inside space-y-3 my-4">
          <li>
            <span className="font-semibold">Cerrado para modificación:</span>{" "}
            Los cambios al comportamiento existente no deben requerir editar
            código existente.
          </li>
          <li>
            <span className="font-semibold">Abierto para extensión:</span> El
            nuevo comportamiento se agrega creando código nuevo, no modificando
            el viejo.
          </li>
        </ul>

        <p>
          El mecanismo es la <span className="font-semibold">abstracción</span>.
          Al definir una interfaz, creas un contrato. Las nuevas
          implementaciones satisfacen el contrato sin cambiar el código
          original.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-6">
          El Patrón: Cómo Funciona OCP
        </h3>

        <div className="rounded-lg border border-blue-600 bg-blue-50 p-4 my-4 dark:bg-blue-950/30">
          <ol className="list-decimal list-inside space-y-3 text-sm text-blue-900 dark:text-blue-100">
            <li>
              <span className="font-semibold">
                Identificar puntos de variación:
              </span>{" "}
              ¿Dónde difieren las diferentes implementaciones?
            </li>
            <li>
              <span className="font-semibold">Extraer una abstracción:</span>{" "}
              Definir una interfaz que todas las implementaciones deben
              satisfacer.
            </li>
            <li>
              <span className="font-semibold">Crear implementaciones:</span>{" "}
              Cada variación se convierte en su propia clase.
            </li>
            <li>
              <span className="font-semibold">Depender de la abstracción:</span>{" "}
              Tu handler depende de la interfaz, no de clases concretas.
            </li>
            <li>
              <span className="font-semibold">Conectar vía DI:</span> Registrar
              implementaciones al inicio.
            </li>
          </ol>
        </div>
      </div>

      {/* Ejemplo en TypeScript */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Ejemplo en TypeScript
        </h2>

        <p>
          El mismo patrón aplica en TypeScript. Aquí está el almacenamiento de
          imágenes en Node.js/Express:
        </p>

        <CodeBlock language="typescript">
          {`// La abstracción
interface IImageStorageService {
  uploadImage(
    stream: NodeJS.ReadableStream,
    fileName: string
  ): Promise<Result<string>>;

  deleteImage(imageUrl: string): Promise<Result<void>>;
}

// Implementación Azure
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

// Implementación AWS - nuevo archivo, sin cambios al código existente
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

// El handler depende de la abstracción
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
        return failure("Error al subir imagen");
      }

      imageUrl = result.value;
    }

    return success(session);
  }
}`}
        </CodeBlock>
      </div>

      {/* Beneficios */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Beneficios de Aplicar OCP
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          1. Menor Riesgo de Regresiones
        </h3>
        <p>
          Al agregar nuevas clases en vez de modificar las existentes, mantienes
          la lógica probada sellada. El almacenamiento Azure sigue funcionando
          porque nunca tocaste ese código.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          2. Pruebas Más Fáciles
        </h3>
        <p>
          Prueba cada implementación independientemente. Una prueba de
          AwsS3StorageService no necesita saber sobre Azure. Las pruebas son más
          pequeñas y enfocadas.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          3. Escalabilidad
        </h3>
        <p>
          A medida que el sistema crece, el servicio principal se mantiene
          pequeño. Solo crece el número de implementaciones, cada una en su
          propio archivo con sus propias pruebas.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          4. Desarrollo en Paralelo
        </h3>
        <p>
          Los desarrolladores pueden trabajar en diferentes implementaciones
          simultáneamente. La interfaz define claramente qué debe implementarse.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          5. Flexibilidad en Tiempo de Ejecución
        </h3>
        <p>
          Con inyección de dependencias, puedes intercambiar implementaciones
          sin cambios de código. Usa Azure en producción, almacenamiento local
          en pruebas.
        </p>
      </div>

      {/* Trampas */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Trampas del Mundo Real
        </h2>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 1: Sobre-Abstracción
        </h3>
        <p>
          No todo necesita una interfaz. Pregúntate: &ldquo;¿Esto tendrá
          múltiples implementaciones?&rdquo; Si no, mantenlo simple. Solo
          abstrae los puntos de variación.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 2: Abstracciones con Fugas
        </h3>
        <p>
          Si tu interfaz expone detalles de implementación, las subclases
          tendrán problemas. Mantén la interfaz enfocada y clara.
        </p>

        <h3 className="text-lg font-semibold text-foreground mt-4">
          Trampa 3: Explosión de Factories
        </h3>
        <p>
          Mantén la factory simple: mapea strings a implementaciones. Usa
          inyección de dependencias para inyectar implementaciones, no para
          instanciarlas dentro de la factory.
        </p>
      </div>

      {/* Checklist */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Checklist: Detectando Violaciones de OCP
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
              ¿Tienes sentencias switch grandes verificando tipos o formatos?
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
              Cuando llegan nuevas variantes, ¿modificas clases existentes?
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
              ¿Hay una clase de servicio que conoce todas las variantes?
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
              ¿Agregar una funcionalidad requeriría modificar múltiples clases
              existentes?
            </label>
          </div>
        </div>

        <p>
          Si respondes &ldquo;sí&rdquo; a alguna de estas, OCP probablemente
          está siendo violado.
        </p>
      </div>

      {/* Conclusión */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Conclusión</h2>

        <p>
          El Principio de Abierto/Cerrado transforma cómo piensas sobre agregar
          funcionalidades. En lugar de modificar código existente (riesgoso,
          frágil), extiendes a través de nuevas implementaciones (seguro,
          aislado).
        </p>

        <p>
          El mecanismo es la abstracción: define una interfaz clara, luego crea
          nuevas implementaciones. El código existente nunca cambia. Las pruebas
          nunca necesitan re-ejecutarse. El riesgo se minimiza.
        </p>

        <p>
          OCP habilita desarrollo en paralelo, pruebas más fáciles y menores
          regresiones. Escala naturalmente: agregar el décimo proveedor de
          almacenamiento es tan seguro como agregar el segundo.
        </p>

        <p>
          La idea clave:{" "}
          <span className="font-semibold">
            diseña para extensión a través de abstracción, no para modificación
            a través de inspección
          </span>
          .
        </p>

        <p>
          En el próximo artículo, exploramos el Principio de Sustitución de
          Liskov, que asegura que los tipos derivados son seguros para usarse en
          lugar de sus tipos base, una propiedad crucial para que OCP funcione
          de manera confiable.
        </p>
      </div>
    </>
  );
}
