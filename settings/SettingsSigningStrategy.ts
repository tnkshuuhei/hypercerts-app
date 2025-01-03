import { SettingsFormValues } from "@/components/settings/settings-form";

export abstract class SettingsSigningStrategy {
  constructor(
    protected address: `0x${string}`,
    protected chainId: number,
  ) {}

  abstract sign(user: SettingsFormValues): Promise<void>;
}
