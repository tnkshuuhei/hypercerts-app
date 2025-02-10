import { SettingsFormValues } from "@/components/settings/settings-form";
import { Address } from "viem";

export abstract class SettingsSigningStrategy {
  constructor(
    protected address: Address,
    protected chainId: number,
  ) {}

  abstract sign(user: SettingsFormValues): Promise<void>;
}
