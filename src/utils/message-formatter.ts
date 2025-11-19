// Message Formatter Utility
// Handles all AI chat message text transformations and formatting
export class MessageFormatter {
  // Remove corrupted emoji and replacement characters
  private static removeCorruptedCharacters(text: string): string {
    return text
      .replace(/\?\?\?+/g, '')           // 3+ question marks
      .replace(/\?\?(?=\s[A-Z])/g, '')   // ?? before capitalized words
      .replace(/�+/g, '')                // Replacement characters
      .replace(/[\uFFFD]/g, '');         // Unicode replacement char
  }

  // Fix arrows and navigation symbols
  private static fixNavigationSymbols(text: string): string {
    return text
      .replace(/([a-zA-Z\)])\s*\?\s*([A-Z"„])/g, '$1 → $2')
      .replace(/"([^"]+)"\s*\?\s*"([^"]+)"/g, '"$1" → "$2"');
  }

  // Fix specific corrupted UI navigation paths
  private static fixUINavigationPaths(text: string): string {
    const pathFixes: [RegExp, string][] = [
      [/Leave Management\s*\?\s*/gi, 'Leave Management → '],
      [/HRConnect\s*\?\s*/gi, 'HRConnect → '],
      [/My Requests\s*\?\s*/gi, 'My Requests → '],
      [/Request Leave\s*\?\s*/gi, 'Request Leave → '],
    ];

    let formatted = text;
    pathFixes.forEach(([pattern, replacement]) => {
      formatted = formatted.replace(pattern, replacement);
    });

    return formatted;
  }

  // Normalize hyphens and dashes
  private static normalizeHyphens(text: string): string {
    return text
      .replace(/‑/g, '-')    // Non-breaking hyphen
      .replace(/—/g, ' — ')  // Em dash
      .replace(/–/g, ' – '); // En dash
  }

  // Clean up excessive whitespace

  private static cleanWhitespace(text: string): string {
    return text
      .replace(/\s+([.,!?])/g, '$1')
      .trim();
  }

  // Convert markdown bold syntax to HTML
  private static convertMarkdownToHTML(text: string): string {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  // Add contextual emojis for display enhancement
  private static addContextualEmojis(text: string): string {
    const emojiMap: [RegExp, string][] = [
      [/Vacation:/gi, '🏖️ Vacation:'],
      [/Sick:/gi, '🏥 Sick:'],
      [/Emergency:/gi, '🚨 Emergency:'],
      [/Annual:/gi, '📅 Annual:'],
      [/Leave:/gi, '📋 Leave:'],
    ];

    let formatted = text;
    emojiMap.forEach(([pattern, replacement]) => {
      formatted = formatted.replace(pattern, replacement);
    });

    return formatted;
  }

  // Main formatting method - applies all transformations in order
  static format(text: string): string {
    let formatted = text;

    // Apply transformations in logical order
    formatted = this.removeCorruptedCharacters(formatted);
    formatted = this.fixNavigationSymbols(formatted);
    formatted = this.fixUINavigationPaths(formatted);
    formatted = this.normalizeHyphens(formatted);
    formatted = this.cleanWhitespace(formatted);
    formatted = this.convertMarkdownToHTML(formatted);
    formatted = this.addContextualEmojis(formatted);

    return formatted;
  }
}