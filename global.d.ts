declare module "expo-file-system" {
  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;

  export function getInfoAsync(
    fileUri: string
  ): Promise<{ exists: boolean; isDirectory: boolean }>;

  export function makeDirectoryAsync(
    fileUri: string,
    options?: { intermediates?: boolean }
  ): Promise<void>;

  export function copyAsync(options: {
    from: string;
    to: string;
  }): Promise<void>;
}
