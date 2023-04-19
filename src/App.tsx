import './styles/globals.css';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const createUserFormSchema = z.object({
  name: z
    .string()
    .nonempty('O nome é obrigatório.')
    .transform((name) => {
      return name
        .trim() // remove espaçamentos no início e no fim
        .split(' ') // separa as palavras no espaço
        .map((word) => {
          // itera sobre cada palavra
          return word[0].toLocaleUpperCase().concat(word.substring(1)); // capitaliza a primeira letra de cada palavra
        })
        .join(' '); // junta as palavras novamente com um espaço
    }),
  email: z
    .string()
    .nonempty('O e-mail é obrigatório.') // torna o campo obrigatório
    .email('Formato de e-mail inválido.') // valida o formato do e-mail com um regex do zod
    .endsWith('@gmail.com', 'O e-mail deve ser do Gmail.') // valida se o e-mail termina com @gmail.com
    .toLowerCase(), // converte o e-mail para minúsculo
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres.'),
  techs: z
    .array(
      z.object({
        title: z.string().nonempty('O título é obrigatório.'),
        knowledge: z.coerce.number().min(1).max(10),
      })
    )
    .min(2, 'É necessário informar pelo menos duas tecnologias.'),
});

type CreateUserFormData = z.infer<typeof createUserFormSchema>;

export function App() {
  const [output, setOutput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'techs',
  });

  function addNewTech() {
    append({
      title: '',
      knowledge: 1,
    });
  }

  function removeNewTech() {
    remove(fields.length - 1);
  }

  function createUser(data: CreateUserFormData) {
    setOutput(JSON.stringify(data, null, 2));
  }

  return (
    <main className='h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-800 to-purple-800 gap-10'>
      <form
        onSubmit={handleSubmit(createUser)}
        className='flex flex-col gap-4 w-full max-w-xs'
      >
        <div className='flex flex-col gap-1'>
          <label className='text-neutral-300' htmlFor='name'>
            Nome
          </label>
          <input
            type='text'
            {...register('name')}
            className='bg-transparent border rounded-md border-neutral-300/20 px-2 py-2 text-neutral-300 outline-none'
          />
          {errors.name && (
            <span className='text-red-300 text-xs'>{errors.name.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-neutral-300' htmlFor='email'>
            E-mail
          </label>
          <input
            type='email'
            {...register('email')}
            className='bg-transparent border rounded-md border-neutral-300/20 px-2 py-2 text-neutral-300 outline-none'
          />
          {errors.email && (
            <span className='text-red-300 text-xs'>{errors.email.message}</span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label className='text-neutral-300' htmlFor='password'>
            Senha
          </label>
          <input
            type='password'
            {...register('password')}
            className='bg-transparent border rounded-md border-neutral-300/20 px-2 py-2 text-neutral-300 outline-none'
          />
          {errors.password && (
            <span className='text-red-300 text-xs'>
              {errors.password.message}
            </span>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor=''
            className='flex items-center justify-between text-neutral-300'
          >
            Tecnologias
            <div className='flex flex-col gap-1'>
              <button
                type='button'
                onClick={addNewTech}
                className='text-emerald-400 text-xs outline-none'
              >
                Adicionar
              </button>
              <button
                type='button'
                onClick={removeNewTech}
                className='text-red-400 text-xs outline-none'
              >
                Remover
              </button>
            </div>
          </label>

          {fields.map((field, index) => {
            return (
              <div key={field.id} className='flex gap-2'>
                <input
                  type='text'
                  {...register(`techs.${index}.title`)}
                  className='bg-transparent border rounded-md border-neutral-300/20 text-neutral-300 h-10 px-3 outline-none w-full'
                />

                <input
                  type='number'
                  {...register(`techs.${index}.knowledge`)}
                  className='bg-transparent border rounded-md border-neutral-300/20 text-neutral-300 h-10 px-3 outline-none w-16'
                />
              </div>
            );
          })}

          {errors.techs && (
            <span className='text-red-300 text-xs'>{errors.techs.message}</span>
          )}
        </div>

        <button
          type='submit'
          className='bg-emerald-600 hover:bg-emerald-500 transition-colors rounded font-semibold text-white h-10 mt-2'
        >
          Salvar
        </button>
      </form>

      <pre>{output}</pre>
    </main>
  );
}
